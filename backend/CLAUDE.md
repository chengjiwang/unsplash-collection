# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Backend-specific notes. Commands, env vars, routing layout, the Prisma client location, and the auth design are in the root `../CLAUDE.md` — not repeated here.

## Tooling gotchas

- `tsconfig.json` sets `noEmit: true` (required by `allowImportingTsExtensions`), so `tsc` in `pnpm build` is **type-check only**. Nothing is ever written to `dist/`, which means `pnpm start` (`node dist/server.js`) doesn't work as configured. The only part of `build` that produces output is `prisma:bundle`, which writes `generated/prisma/client.js`. Use `pnpm dev` locally, and `npx tsc -p .` for a standalone type-check.
- `pnpm lint` is currently broken: `eslint.config.js` imports `@eslint/js`, which isn't installed.
- New dependencies that need install scripts (e.g. Prisma, esbuild) must be listed under `onlyBuiltDependencies` in `pnpm-workspace.yaml`, or pnpm 10 skips their scripts.
- Express 5 types `req.params` loosely, so controllers wrap values in `String(req.params['id'])`.

## Controller conventions

Each handler is `async (req, res, next): Promise<void>` with the whole body in `try { … } catch (err) { next(err) }`. For early exits, write `res.status(...).json(...)` followed by a bare `return;`. Never `return res...`, because the return type is `void`.

- **Validation:** `Schema.safeParse(req.body)`. On failure, return a fixed, human-readable `{ error }` string, not the Zod issues.
- **Ownership:** look the collection up by `id` with `findUnique`, then compare `collection.userId !== req.userId`. Respond **404 `Collection not found`** both when the row is missing and when another user owns it (so ownership isn't leaked; never 403). Every route that takes `:id` repeats this check.
- **Uniqueness:** checked with a `findUnique` on the compound key (`userId_name`, `collectionId_imageId`) _before_ the insert, not by catching Prisma `P2002`. Two requests racing each other can still reach the 500 handler.
- **Status codes in use:**
  - duplicate collection name → 400
  - duplicate image in collection → 409
  - any login failure (bad body, unknown email, wrong password) → 401 `Invalid credentials`
  - duplicate email on register → 400
- **Request/response shapes:**
  - The image routes key off the **Unsplash photo id**. `DELETE /api/collections/:id/images/:imageId` uses `imageId` = the Unsplash id (`collection_images.image_id`), not the row's UUID.
  - Collection responses are hand-mapped to snake_case. The Unsplash proxy routes pass the **raw Unsplash JSON** through unchanged, so the frontend types mirror Unsplash's schema.

## Unsplash proxy

- Every handler re-reads `UNSPLASH_ACCESS_KEY` and returns a 500 if it's missing. Requests send `Authorization: Client-ID …` and `Accept-Version: v1`. Search defaults to `per_page=10`.
- The download route first calls Unsplash's `/photos/:id/download`, which Unsplash's API guidelines require for download tracking. It then fetches the returned URL and sends the bytes back as an attachment, always named `<id>.jpg`.

## Auth details

- `JWT_SECRET` is non-null-asserted, so if it's missing, signing and verification throw at request time rather than at startup.
- The cookie `maxAge` is hard-coded to 7 days in `lib/auth.ts`, separately from `JWT_EXPIRES_IN`. Keep the two in sync if you change either.
- `logout` calls `res.clearCookie('token')` without the `sameSite: 'none'` / `secure` options used when the cookie is set. In the cross-site production setup that may fail to clear it. The frontend mainly relies on the Bearer token in `localStorage` anyway.

## Database / migrations

- Cascade is only partial: `User → Collection` uses `onDelete: Cascade`, but `CollectionImage → Collection` doesn't. Deleting a collection (no endpoint exists yet) needs a schema change or must delete its images first.
- `20260521000000_add_users_auth` is a hand-edited migration with a data step: it assigns legacy collections to a placeholder `default@example.com` user whose `password_hash` is empty. Write any future migration that touches existing rows the same way: edit the SQL produced by `prisma migrate dev --create-only` before applying it.
- `server.ts` only logs DB connection failures and doesn't exit. `unhandledRejection` and `uncaughtException` are also logged without exiting. Because the process stays up, a bad `DATABASE_URL` shows up as 500s on requests rather than as a crash.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Full-stack devChallenges "Unsplash Collection" app: search Unsplash photos and save them into per-user collections. Two independent pnpm projects (no root workspace) — `backend/` (Express 5 + Prisma 7 + PostgreSQL) and `frontend/` (Vue 3 + Vite + TanStack Query + Pinia). Both deploy to Vercel. Detailed specs (in Chinese) live in `resources/` (`SPEC-Backend.md`, `SPEC-Frontend.md`, `Requirements*.md`).

## Commands

Run commands inside `backend/` or `frontend/` respectively.

**Local DB:** `docker compose up -d` (repo root) starts Postgres 16 on `localhost:5432` (user/pass `postgres`, db `unsplash_collection`).

**Backend** (`backend/`)
- `pnpm dev` — tsx watch on `src/server.ts` (port `PORT`, default 3001)
- `pnpm build` — `prisma generate` + esbuild-bundle the generated client, then `tsc` (type-check only — see `backend/CLAUDE.md`)
- `pnpm lint` / `pnpm lint:fix` (currently broken — see `backend/CLAUDE.md`)
- `pnpm prisma migrate dev --name <name>` — create/apply a migration; `pnpm prisma generate` after schema edits
- No backend test suite exists.

Required env (`backend/.env`): `DATABASE_URL`, `JWT_SECRET`, `UNSPLASH_ACCESS_KEY`, `FRONTEND_URL` (CORS origin); optional `JWT_EXPIRES_IN` (default `7d`), `PORT`, `NODE_ENV`.

**Frontend** (`frontend/`)
- `pnpm dev` — Vite dev server
- `pnpm build` — `vue-tsc` type-check in parallel with `vite build`
- `pnpm type-check`
- `pnpm lint` — oxlint then eslint (both with `--fix`)
- `pnpm format` — prettier on `src/`
- `pnpm test:unit` — Vitest (jsdom); single file: `pnpm test:unit src/__tests__/App.spec.ts`; single test: add `-t "<name>"`

Required env (`frontend/.env`): `VITE_API_BASE_URL` (e.g. `http://localhost:3001`).

## Architecture

### Backend
- `src/app.ts` wires middleware (CORS with credentials, cookie-parser, JSON) and mounts three routers under `/api/auth`, `/api/collections`, `/api/unsplash`; `server.ts` only listens and connects the DB.
- Layering: `routes/` → `controllers/` (all logic + Prisma calls inline; no service layer). Controllers wrap bodies in `try/catch` and forward to `next(err)`; the global `errorHandler` returns 500 `{ error }`. Validation errors are returned directly as `400 { error }` using Zod schemas (`schemas/` or inline).
- **Prisma client is generated to `backend/generated/prisma`** (git-ignored) and imported via relative path `../../generated/prisma/client.js` — not from `@prisma/client`. It uses the `@prisma/adapter-pg` driver adapter (`lib/prisma.ts`). Datasource URL comes from `prisma.config.ts`, not the schema. The build bundles the generated client with esbuild for Vercel.
- ESM with `.js` extensions in relative imports (required by `tsc` output).
- Auth: `authenticate` middleware accepts **either** `Authorization: Bearer <token>` **or** the `token` HttpOnly cookie, and sets `req.userId` (typed in `types/express.d.ts`). Login/register both set the cookie and return `{ token, user }` in the body. Cookie is `sameSite: none; secure` in production (cross-site Vercel domains).
- All `/api/collections` routes are authenticated and must scope queries by `req.userId`. `GET /api/collections` supports `image_id`, `exclude_image_id` (used by the "add to collection" modal) and `name` (case-insensitive contains) query filters.
- `/api/unsplash/*` is a thin proxy to `api.unsplash.com` so the access key stays server-side.
- DB: `User` 1–n `Collection` 1–n `CollectionImage`. Unsplash image metadata (urls, author, published date) is denormalized into `collection_images`; uniqueness on `(userId, name)` and `(collectionId, imageId)`. Prisma fields are camelCase mapped to snake_case columns, and API responses are hand-mapped to **snake_case** JSON (frontend types in `src/types` match this).

### Frontend
- Data flow: `src/api/*` (raw axios calls via shared `api/axios.ts` client) → `src/queries/*` (TanStack Query `useQuery`/`useMutation` composables) → views/components. Add new server interactions in that order.
- Query keys: `['collections', params]`, `['collection', id]`, `['collectionImages', id]`. Mutations in `queries/mutations.ts` invalidate `['collections']` and show `vue-sonner` toasts.
- Auth state: Pinia `authStore` persists `user` and `token` to `localStorage`; the axios request interceptor attaches `Bearer` token, and a 401 response from any non-`/api/auth/*` endpoint clears the store, clears the Query cache (`lib/queryClient.ts`) and `router.push`es to `/login?redirect=<current path>` (no full page reload). `/api/auth/*` 401s are skipped so the login form can show "Invalid credentials". `isLoggedIn` is derived from the stored user (no `/me` check on boot).
- Router guard: routes with `meta.requiresAuth` redirect to `/login?redirect=<path>`; `useLogin` returns to `redirect` (default `/collections`).
- UI primitives in `src/components/ui/` are shadcn-vue (reka-ui, new-york style) generated components — configured by `components.json`; prefer adding via shadcn-vue rather than hand-writing. Tailwind v4 config lives in `src/assets/main.css` (no tailwind.config). `@` aliases `src/`.
- `vercel.json` rewrites all paths to `index.html` for SPA history routing.
- Code style: Prettier, no semicolons, single quotes (frontend); backend uses semicolons.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Frontend-specific notes. Commands, env vars, and the overall data-flow / auth / routing design are in the root `../CLAUDE.md` — not repeated here.

## Commands (gotchas)

- `pnpm test:unit` starts Vitest in **watch mode**; use `pnpm test:unit --run` for a one-shot run.
- `pnpm lint` runs with `--fix` and rewrites files; there is no check-only lint script.
- The only test, `src/__tests__/App.spec.ts`, is leftover Vite scaffold (it expects `"You did it!"`) and currently fails. `App.vue` needs Pinia, router and `VueQueryPlugin` installed to mount, so a real test must provide those plugins via `global.plugins`.
- `tsconfig.app.json` turns on `noUncheckedIndexedAccess`, so array/record indexing returns `T | undefined` (hence patterns like `preview_images[0]?.` and `route.params['id']`). Test files are excluded from the app tsconfig and covered by `tsconfig.vitest.json`.

## State split

- **Pinia is for UI state only.** `searchStore.keyword` is the single source of truth for search: `SearchBar` writes it on Enter or button click, `HomeView` switches between the hero layout (empty keyword) and the results layout (non-empty), and `PhotoGrid` passes it to `useSearchPhotos`. Because the keyword lives in a store rather than the URL, navigating back from a photo keeps the results. `stores/counter.ts` is unused scaffold.
- **Server state goes through TanStack Query.** Query composables take `Ref`s and build `queryKey` / `enabled` with `computed`, so they refetch reactively. Follow the same pattern for new queries.
- Search uses `useInfiniteQuery` (key `['photos', keyword]`) together with a `useIntersectionObserver` sentinel at the bottom of `PhotoGrid` for infinite scroll. Photo detail uses `['photo', id]`.

## Non-obvious data-flow details

- `AddToCollectionModal` **bypasses the query cache**. It calls `getCollections({ name, exclude_image_id })` directly, with a manual 300 ms debounce and local `ref` state, and refetches every time the dialog opens. Its add mutation is defined inline in the component, not in `queries/mutations.ts`.
- `PhotoView` is public (no `requiresAuth`). For logged-in users it lists the collections that already contain the photo via `useCollections({ image_id }, { enabled: () => authStore.isLoggedIn })`; guests don't fire that request, don't see the list, and "Add to Collection" sends them to `/login?redirect=<photo path>`. Adding or removing invalidates the `['collections']` prefix, which refreshes this list and the collections page.
- Image add/remove mutations invalidate `['collections']` plus that collection's `['collection', id]` and `['collectionImages', id]`. Any new mutation that affects the collection detail page must invalidate those keys too.
- Adding an image copies Unsplash fields into the backend payload (`urls.regular/thumb/small` → `image_url/thumb_url/small_url`, `user.name` → `author_name`, `created_at` → `published_at`). Unsplash responses use the `UnsplashPhoto` type and stored images use `CollectionImage`; don't mix them up. `CollectionImageGrid` links to `/photos/${image.image_id}` (the Unsplash id), not the row `id`.
- Download fetches a blob from `/api/unsplash/photos/:id/download` (the backend proxy) and triggers it through a temporary object-URL `<a>`. It doesn't link to Unsplash directly.
- `LoginView` has a "guest login" button with hard-coded credentials, so that account must exist in the backend DB.

## UI conventions

- **Colors:** use the brand tokens defined in `src/assets/main.css` (`text-brand-ink`, `text-brand-muted`, `bg-brand-border`, `hover:bg-brand-hover`, `from-brand-gradient-from to-brand-gradient-to`) instead of raw hex or gray utilities. Page titles use the gradient-text pattern `bg-linear-to-r … bg-clip-text text-transparent`.
- **Shared pieces:** spinners and skeletons are inline Tailwind (`animate-spin` / `animate-pulse`); there's no shared loader component. Toasts go through `toast` from `vue-sonner`, and the `<Toaster>` is mounted once in `App.vue`.
- **Dialogs:** controlled with `v-model:open`. Newer components use `defineModel('open')` (`AddCollectionModal`); the older ones use a prop plus an `update:open` emit (`AddToCollectionModal`). Prefer `defineModel` going forward.
- **Buttons and icons:** buttons use the shadcn `Button` with a `variant` and heavy class overrides. Icons come from `@lucide/vue`.
- **Design references:** the design mockups and color palette for each page are in `../resources/image/`. `../resources/SPEC-Frontend.md` (page specs and interaction flows) and `../resources/explain-frontend.md` (a Vue-vs-React walkthrough) are written in Chinese.

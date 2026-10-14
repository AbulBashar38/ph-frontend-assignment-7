<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Housing & Roommate Platform — Frontend (B7A7)

Next.js 16.4 (App Router) + React 19.3 frontend for the Housing & Roommate Platform, with three roles: **Tenant**,
**Owner**, and **Admin** (`ADMIN` + `SUPER_ADMIN`). It consumes the REST API in the sibling repo
`../ph-backend-assignment-6` (live: `https://ph-backend-assignment-6.vercel.app`, Swagger at `/api/docs`).

**Full build guide: [`../CLAUDE.md`](../CLAUDE.md).** It holds the graded assignment requirements, architecture
decisions, endpoint map, page list, required backend changes, and build order. Read it before starting any feature.
If you only have this repo (that file is missing), the essentials are below.

## Sibling folders

- `../example-frontend/` — **read-only reference.** Build every feature the way it does: `api/` → `hooks/` →
  `types/` → `validation/` → `components/modules/<feature>/` → `app/.../page.tsx`. Never edit it.
- `../ph-backend-assignment-6/` — the API. Check exact request/response shapes in its Swagger or in
  `src/app/module/<m>/<m>.validation.ts` / `<m>.service.ts`. Never guess field names. Backend edits follow that repo's
  `CLAUDE.md`.

## Stack

TypeScript (strict, no `any`) · Tailwind v4 + shadcn/ui (`base-nova`) · TanStack Query · Zustand (client-only state)
· `@tanstack/react-form` + Zod · `ofetch` · Sonner toasts · Recharts · Lucide · `next/image` · Stripe (test mode) via
the backend · Biome for lint/format.

## Must-follow rules

- **yarn 1 only** (`packageManager: yarn@1.22.22`). Don't use npm or bun, and don't commit another lockfile.
- **Server Components by default.** Add `"use client"` only for state, effects, or handlers, and keep client
  components small.
- **Auth:** API calls go through the same-origin rewrite `/api/v1/*` → `${API_URL}/api/v1/*`, so the backend's
  httpOnly `accessToken`/`refreshToken` cookies sit on this domain. `src/proxy.ts` (Next 16's name for middleware)
  protects `/dashboard` (tenant), `/owner`, and `/admin` by decoding the JWT role. The backend still verifies every
  call. On a 401, `lib/apiClient.ts` refreshes **once** (one shared promise) and retries.
- **Role-based UI** through `useAuth()`. Show only the actions the role may take and that the current status allows
  (status transitions are in the backend's `prisma/schema/enums.prisma`).
- **Every data page:** `loading.tsx` skeleton, an empty state on every list, `error.tsx` boundary, and Sonner toasts
  with the backend's `message` (`getErrorMessage(err)`).
- **URL state:** search, filters, sort, tabs, and pagination live in `useSearchParams`.
- **Forms:** `@tanstack/react-form` + Zod schemas that match the backend's validation.
- **Light theme only** (`forcedTheme="light"` in `providers/theme.provider.tsx`). Don't add `dark:` styles to new code.
- **Images:** `next/image` only. **Public pages** export `metadata` / `generateMetadata`.
- **Payments:** start Stripe checkout, then handle `/payment/success` and `/payment/cancel`. Never set a payment status
  from the client.
- **Real API data only:** no mocks, lorem ipsum, or placeholder images.
- Reuse the shared components (`components/shared/*`) and hooks instead of copy-pasting UI.
- Code style follows the example: double quotes, semicolons, 2-space indent, kebab-case files, the `@/*` alias.

## Commands

```bash
yarn dev      # http://localhost:3000 (backend: cd ../ph-backend-assignment-6 && npm run dev → :5050)
yarn build    # type check + production build
yarn lint     # biome check
```

Env vars live in `.env.local` (template: `.env.example`): `API_URL`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_GOOGLE_CLIENT_ID`, and `NEXT_PUBLIC_DEMO_{ADMIN,TENANT,OWNER}_{EMAIL,PASSWORD}`.

## Done means

`yarn build` and `yarn lint` pass, the feature follows the rules above, it works at phone width, and it is committed
with a conventional message (`feat: …`, `fix: …`, `refactor: …`, `chore: …`). Commit one finished feature at a time
(the assignment needs 20+ meaningful commits).

# ScholarMate – Smart Scholarship Finder

A web application helping Indian college students (especially Maharashtra/Mumbai) discover scholarships and understand their preliminary eligibility.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/scholarmate run dev` — run the frontend (proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite, Tailwind CSS, shadcn/ui, wouter, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod v3, drizzle-zod
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/scholarships.ts` — scholarships table schema
- `artifacts/api-server/src/routes/scholarships.ts` — scholarship API routes
- `artifacts/scholarmate/src/` — React frontend (pages, components)

## Architecture decisions

- Integer fields in OpenAPI response schemas use `type: number` (not `type: integer`) because Orval v8 generates `zod.int()` for `integer` which is Zod v4 only; the catalog pins Zod v3.
- `casteCategories` is stored as a comma-separated string in Postgres (e.g. `"OBC,SC"`) and parsed to an array in the API layer — avoids needing `text[]` operator support in filters.
- `GET /scholarships/stats` route is declared **before** `GET /scholarships/:id` in the router file to avoid Express shadowing the `/stats` literal path.
- Default filter for `GET /scholarships` is `isActive=true` unless explicitly overridden.

## Product

- Home page with hero, live platform stats, and featured scholarship cards
- Discover page with full filter panel (state, provider type, course level, caste category, gender) and paginated scholarship grid
- Scholarship detail page with full eligibility info, source attribution, and official application link
- 29 real scholarships seeded (MahaDBT, NSP, Buddy4Study, institutional sources)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always re-run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`
- Use `type: number` (not `type: integer`) in OpenAPI response schemas to stay compatible with Zod v3
- Do not add leaf workspace packages to root `tsconfig.json` references

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Scholarship data attribution: every record has `sourceName` + `sourceUrl` + `applicationUrl`

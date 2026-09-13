BestDoctorDhaka.com — Bangladesh-focused healthcare directory (Dhaka-first).

Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS, PostgreSQL, Prisma, Redis, Vitest, Playwright. See `CLAUDE.md`, `AGENTS.md`, and `docs/` for project rules and phase scope.

## Prerequisites

- Node.js 20+ (project developed against Node 26)
- PostgreSQL (a local server you already have running; see below)
- Docker (for Redis)

## Local Setup

### 1. Install dependencies

```bash
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. PostgreSQL

This project does not containerize PostgreSQL — it uses whatever local Postgres server you already have. Create a dedicated role and two databases (dev + test):

```bash
psql -U "$(whoami)" -d postgres -c "CREATE ROLE bestdoctordhaka WITH LOGIN PASSWORD 'bestdoctordhaka' CREATEDB;"
psql -U "$(whoami)" -d postgres -c "CREATE DATABASE bestdoctordhaka OWNER bestdoctordhaka;"
psql -U "$(whoami)" -d postgres -c "CREATE DATABASE bestdoctordhaka_test OWNER bestdoctordhaka;"
```

(`CREATEDB` is required so Prisma can create its shadow database during `migrate dev`.)

If your Postgres isn't on the default port 5432, adjust the connection strings below accordingly.

### 3. Redis

Redis is containerized since it's not something most machines have installed natively:

```bash
docker compose up -d
```

This starts Redis on `localhost:6379`.

### 4. Environment variables

```bash
cp .env.example .env.local
```

The defaults in `.env.example` match the role/databases created above. `.env.test` is committed (non-secret, deterministic local values) and holds `TEST_DATABASE_URL`/`TEST_REDIS_URL`, plus a `DATABASE_URL` pointed at the test database, for integration tests — Next.js does not load `.env.local` when `NODE_ENV=test`.

### 5. Run migrations

```bash
npx prisma migrate dev
```

Applies the Doctor Directory schema (Doctor, Specialty, Location, Hospital, Chamber) to your dev database. Run the same migration against `bestdoctordhaka_test` (e.g. `DATABASE_URL=$TEST_DATABASE_URL npx prisma migrate deploy`) before running integration tests.

### 6. Seed local data

```bash
npm run db:seed
```

Loads a handful of deterministic, clearly-fake doctors/specialties/locations into your dev database (see `prisma/seed.ts`). Safe to re-run.

### 7. Start the dev server

```bash
npm run dev
```

Visit http://localhost:3000. Check http://localhost:3000/api/health to confirm the app can reach both PostgreSQL and Redis, or browse http://localhost:3000/doctors to see the seeded directory.

## Testing

```bash
npm run test              # unit tests (Vitest, no external services needed)
npm run test:integration  # integration tests (needs Postgres + Redis running)
npm run test:e2e          # Playwright smoke tests (needs Postgres + Redis running)
```

## Quality Gate

```bash
npm run lint
npm run typecheck
npm run build
```

A pre-commit hook (Husky + lint-staged) runs ESLint on staged files automatically.

## Project Structure

```text
src/
├── app/                 # Next.js App Router routes
│   ├── api/health/      # DB + Redis connectivity check
│   ├── doctors/         # Doctor listing + profile pages
│   ├── specialties/     # Specialty index + landing pages
│   ├── locations/       # Location index + landing pages
│   ├── sitemap.ts
│   └── robots.ts
├── modules/
│   ├── doctor/          # types, validation, repository, service, mapper
│   ├── specialty/
│   └── location/
├── components/
│   ├── doctor/          # DoctorCard
│   └── shared/          # Breadcrumbs, Pagination
├── lib/
│   ├── db/              # Prisma client singleton
│   ├── cache/           # Redis client singleton
│   ├── validation/      # Shared zod schemas (slug, pagination)
│   ├── pagination/       # Offset pagination helpers
│   ├── slug/            # Slug generation
│   ├── seo/             # Site URL constant
│   └── utils/           # Framework-agnostic helpers
└── generated/           # Prisma-generated client (gitignored, regenerate with `npm run prisma:generate`)
prisma/                  # Prisma schema, migrations, seed.ts
tests/e2e/               # Playwright specs
```

There is no admin UI or authenticated mutation path yet — `Doctor.createDoctor` (in `src/modules/doctor/doctor.service.ts`) is invoked only from `prisma/seed.ts` and other local scripts, never over HTTP. The Hospital module (public pages, services) lands in Phase 2; Phase 1 only stores a minimal Hospital record for doctor affiliations.

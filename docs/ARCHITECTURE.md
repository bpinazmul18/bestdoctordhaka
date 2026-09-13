# BestDoctorDhaka Architecture

## Goal
Build a simple, maintainable, secure and SEO-friendly healthcare directory that can scale gradually without premature infrastructure complexity.

Architecture style: Modular Monolith.

## Stack
- Next.js
- TypeScript
- App Router
- React
- Tailwind CSS
- PostgreSQL
- Prisma
- Redis
- Vitest
- Playwright
- ESLint
- Husky
- lint-staged

## Next.js
Use the installed Next.js version as the source of truth.

Current project version: Next.js 16.3.5.

Do not change the version without a concrete reason.

Prefer Server Components by default and Client Components only when interactivity/browser APIs require them.

Use framework-native routing and metadata APIs.

## Recommended Structure
```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── admin/
│   ├── api/
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── shared/
├── modules/
│   ├── doctor/
│   ├── hospital/
│   ├── diagnostic/
│   ├── specialty/
│   ├── location/
│   ├── review/
│   ├── verification/
│   ├── search/
│   ├── provider/
│   ├── subscription/
│   └── appointment/
├── lib/
│   ├── db/
│   ├── auth/
│   ├── cache/
│   ├── validation/
│   ├── seo/
│   └── utils/
└── types/
```

The exact structure may evolve, but module boundaries should remain clear.

## Module Boundaries
Business modules should own relevant:
- types
- validation
- services
- repositories/database access where appropriate
- business rules
- tests

Avoid putting all business logic into generic utility files.

## Business Logic
Keep business logic outside UI components.

Preferred:
UI → Server Action/API → Service → Repository/Prisma → PostgreSQL.

Reusable business logic belongs in services/domain code.

## Database
Use Prisma with PostgreSQL.

Database access stays server-side.

Never expose database credentials or privileged operations to the client.

## API / Server Actions
Use Server Actions for suitable UI mutations.

Use API routes for external clients, webhooks, or clear HTTP boundaries.

Validate all external input.

## Authentication / Authorization
Authentication identifies the user; authorization determines what they can do.

Authorization must be enforced server-side.

Example:
Doctor A can edit Doctor A profile, but cannot edit Doctor B profile.

## Healthcare Data Integrity
Never fabricate credentials, BMDC information, verification, affiliations, reviews, or medical claims.

Unknown data should remain unknown/unverified/pending as appropriate.

## SEO
Public pages are SEO-critical.

Important routes:
```text
/doctors/[slug]
/hospitals/[slug]
/diagnostics/[slug]
/specialties/[slug]
/locations/[slug]
/articles/[slug]
```

SEO should support metadata, canonical URLs, structured data, sitemap, robots, breadcrumbs and internal linking.

## Search
Initial search uses PostgreSQL capabilities.

Keep search behind a service boundary so a future search engine can be introduced without rewriting the UI.

## Caching / Redis
Use Redis only when there is a clear requirement such as caching, rate limiting, background jobs or temporary state.

Do not introduce a job system before an actual asynchronous workload exists.

## File Storage
Uploaded provider assets should use object storage when implemented.

Validate file type, size, filename and access permissions.

## Security
Always:
- validate external input
- enforce server-side authorization
- protect secrets
- secure sessions
- protect webhooks
- use rate limiting where appropriate
- avoid sensitive-data leakage

## Performance
Prioritize server rendering where appropriate, efficient queries, optimized images, minimal client JavaScript, pagination and sensible caching.

Measure before complex optimization.

## Testing
Use Vitest for unit/integration tests and Playwright for critical E2E journeys.

## Dependencies
Before adding a dependency:
1. Confirm real need.
2. Check built-in/framework capability.
3. Check maintenance and compatibility.
4. Prefer focused mature packages.
5. Avoid duplication.

## Architecture Decision Rule
Prefer:
Simple → Modular → Testable → Secure → SEO-friendly → Observable → Scalable when needed.

Major architecture changes require explicit approval.

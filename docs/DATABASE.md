# BestDoctorDhaka Database Guidelines

## Database
Primary database: PostgreSQL.
ORM: Prisma.

Do not introduce another primary database without explicit approval.

## Principles
1. Correctness before optimization.
2. Prefer normalized relational data.
3. Use explicit relationships.
4. Use database constraints for integrity.
5. Add indexes based on real query patterns.
6. Avoid premature denormalization.
7. Never silently alter production data.

## Core Entity Direction
Expected entities:
- Doctor
- Hospital
- DiagnosticCenter
- Specialty
- Location
- Chamber
- Review
- Verification
- User
- Provider
- Subscription
- Payment
- Appointment
- Article

Do not implement all entities during Phase 0. Introduce them with their feature phase.

## IDs
Use a consistent internal ID strategy.

Public entities should generally use stable unique slugs rather than exposing internal IDs.

Example:
`/doctors/dr-ahmed-hassan`

## Timestamps
Persistent entities should generally include `createdAt` and `updatedAt` where appropriate.

## Slugs
Public entities should use unique, lowercase, URL-safe, readable and stable slugs.

Do not silently change published slugs.

## Relationships
Use explicit foreign keys.

Examples:
- Doctor → Specialty
- Doctor → Hospital
- Doctor → Chamber
- Doctor → Location
- Hospital → Location
- DiagnosticCenter → Location

Use join tables for many-to-many relationships.

## Constraints
Use database constraints for:
- unique slugs
- unique identifiers
- foreign keys
- required fields
- appropriate provider identifiers

Application validation is still required.

## Indexes
Consider indexes for:
- slug
- status
- specialtyId
- locationId
- verification status
- createdAt
- searchable identifiers

Do not index every column.

## Search
Use PostgreSQL initially.

Do not introduce OpenSearch/Elasticsearch without measurable requirements.

## Pagination
Never load unbounded directory data.

Use pagination for doctors, hospitals, diagnostics, reviews, articles and admin tables.

Offset pagination is acceptable initially. Cursor pagination can be introduced when justified.

## Prisma
Use Prisma server-side.

Keep complex database operations behind service/repository boundaries where practical.

## Migrations
All schema changes use Prisma migrations.

Development:
```bash
npx prisma migrate dev
```

Production:
```bash
npx prisma migrate deploy
```

Never use `prisma db push` as the production migration strategy.

Never run `npx prisma migrate reset` against production.

## Migration Safety
Treat these as high-risk:
- dropping tables/columns
- nullable → required
- unique constraints
- enum changes
- data type changes

Prefer staged migrations for deployed systems.

## Transactions
Use transactions when multiple related writes must succeed or fail together, such as:
- provider + chamber
- subscription state changes
- appointment creation
- verification transitions

## Seed Data
Seed data must be deterministic, minimal, repeatable and clearly fake.

Never seed fake:
- BMDC registrations
- verification records
- medical credentials
- patient reviews
- patient experiences

## Healthcare Integrity
Never invent doctor qualifications, BMDC information, verification, hospital affiliations, diagnostic services or medical claims.

Use explicit states such as:
`pending`, `verified`, `rejected`, `expired`, `suspended` when appropriate.

## Reviews
Review data should support moderation.

Never fabricate reviews.

## Authentication Data
Never store plaintext passwords or expose sensitive authentication data.

## Environment Variables
Never commit secrets.

Use `.env.local` for local secrets and `.env.example` for placeholders.

Never expose server-only secrets through public environment variables.

## Testing
Database integration tests must use a dedicated test database/environment.

Never run automated tests against production.

## Query Performance
Before optimizing:
1. Identify the slow query.
2. Inspect query shape.
3. Check rows returned.
4. Check joins/includes.
5. Check indexes.
6. Measure.
7. Optimize only when justified.

Avoid N+1 queries.

## Production Safety
Before production schema/data changes:
- verify environment
- verify migration
- understand affected data
- confirm backup strategy
- confirm application compatibility

Never run destructive SQL casually.

## Definition of Done
A database task is complete when schema, relationships, constraints, indexes, migration, validation and relevant tests are correct, and lint/typecheck/build pass.

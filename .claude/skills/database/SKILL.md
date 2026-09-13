# Database Skill — BestDoctorDhaka.com

## Purpose
This skill defines database design, PostgreSQL, Prisma, migrations, seed data, query patterns, performance, security, and data-integrity rules.

Project style: solo-developer modular monolith.
Primary database: PostgreSQL.
ORM: Prisma.

Do not introduce another primary database or ORM without explicit approval.

## Principles
1. Correctness before optimization.
2. Keep schema simple and understandable.
3. Prefer normalized relational data.
4. Use explicit relationships.
5. Use database constraints for integrity.
6. Add indexes based on real query patterns.
7. Avoid premature denormalization.
8. Never silently modify production data.
9. Every schema change must be migration-based.
10. Keep database access server-side.

## Core Entities
Expected entities include:
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

Do not implement all entities during Phase 0. Introduce them with their roadmap phase.

## IDs
Use one consistent internal ID strategy.
Public entities should generally use stable unique slugs rather than internal IDs.

Example:
`/doctors/dr-ahmed-hassan`

## Timestamps
Persistent entities should generally have `createdAt` and `updatedAt` where appropriate.

## Slugs
Public slugs should be:
- lowercase
- URL-safe
- human-readable
- unique
- stable after publication

Do not silently change a published slug. If a change is required, use a redirect strategy.

## Relationships
Use explicit foreign keys.
Use join tables for many-to-many relationships.

Examples:
- Doctor → Specialty
- Doctor → Hospital
- Doctor → Chamber
- Doctor → Location
- Hospital → Location
- DiagnosticCenter → Location

Avoid duplicating relationship data without a strong reason.

## Constraints
Use database-level constraints for:
- unique slugs
- unique provider identifiers
- unique emails where appropriate
- foreign keys
- required fields
- relationship integrity

Application validation is required in addition to constraints.

## Indexes
Consider indexes for actual query patterns such as:
- slug
- status
- specialtyId
- locationId
- verification status
- createdAt
- searchable provider identifiers

Composite indexes must follow real filter/sort patterns.
Do not index every column.

## Search
Use PostgreSQL capabilities initially.
Keep search behind a service boundary so a future search engine can be introduced if justified.
Do not introduce OpenSearch/Elasticsearch without measurable requirements and approval.

## Pagination
Never load unbounded directory data.
Use pagination for doctors, hospitals, diagnostics, reviews, articles, and admin tables.
Offset pagination is acceptable initially; cursor pagination may be introduced when justified.

## Prisma
Use Prisma server-side.
Keep schema readable.
Avoid scattering Prisma queries across UI components.
Prefer services/repositories for reusable database operations.

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
Never run `prisma migrate reset` against production.

Treat these as high-risk:
- dropping columns/tables
- nullable → required changes
- unique constraints
- enum changes
- data type changes

Prefer staged migrations for deployed systems.

## Transactions
Use transactions when multiple writes must succeed or fail together, for example:
- provider + chamber creation/update
- subscription state transitions
- appointment creation
- verification transitions

## Seed Data
Seed data must be deterministic, minimal, repeatable, and clearly fake.

Never seed fake:
- BMDC registrations
- verification records
- medical credentials
- patient reviews
- patient experiences

## Healthcare Integrity
Never invent doctor qualifications, BMDC information, verification, hospital affiliations, diagnostic services, reviews, or medical claims.
Use explicit states such as `pending`, `verified`, `rejected`, `expired`, `suspended` when appropriate.

## Authentication Data
Never store plaintext passwords.
Never expose authentication secrets or privileged database fields to clients.

## Environment Variables
Use `.env.local` for local secrets and `.env.example` for placeholders.
Never commit secrets.
Never expose server-only secrets as public environment variables.

## Testing
Database integration tests must use a dedicated test database/environment.
Never run automated tests against production.
Test constraints, relationships, transactions, pagination, not-found cases, and failure paths.

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
A database task is complete when schema, relationships, constraints, indexes, migration, validation, relevant tests, lint, typecheck, and build are correct.

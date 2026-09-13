# Database Skill — BestDoctorDhaka.com

## Purpose

This skill defines database design, Prisma, PostgreSQL, migrations, seed data, query patterns, and data-integrity rules for BestDoctorDhaka.com.

The project is a solo-developer modular monolith.

Primary database:

- PostgreSQL

ORM:

- Prisma

Do not introduce another ORM or database unless explicitly approved.

---

## Core Principles

1. Design for correctness before optimization.
2. Keep the schema simple and understandable.
3. Prefer normalized relational data.
4. Avoid premature denormalization.
5. Avoid microservice-style database separation.
6. Keep business rules outside Prisma queries where practical.
7. Never silently modify production data.
8. Never use destructive database operations casually.
9. Every schema change must be migration-based.
10. Database changes must be backward-aware when the application is already deployed.

---

## Schema Design

When creating a new entity:

1. Define the business purpose.
2. Identify required and optional fields.
3. Identify relationships.
4. Identify unique constraints.
5. Identify indexes.
6. Identify deletion behavior.
7. Identify audit requirements.
8. Consider SEO implications where applicable.
9. Consider verification/trust implications where applicable.

Use explicit relationships.

Prefer:

- `createdAt`
- `updatedAt`

for persistent entities where appropriate.

Use appropriate PostgreSQL data types.

Do not store structured data as JSON when a relational model is clearly more appropriate.

Use JSON only when:

- the structure is genuinely flexible
- relational querying is unnecessary
- there is a clear reason to avoid additional tables

---

## IDs

Use a consistent ID strategy throughout the project.

Do not introduce multiple ID strategies without a concrete reason.

IDs must not expose sensitive information unnecessarily.

Public URLs should generally use a stable SEO-friendly slug rather than exposing internal database IDs.

Example:

`/doctors/dr-ahmed-hassan`

instead of:

`/doctors/18291`

---

## Slugs

Public entities that require SEO-friendly URLs should have unique slugs.

Examples:

- Doctor
- Hospital
- Diagnostic Center
- Specialty
- Location
- Article

Slug requirements:

- lowercase
- URL-safe
- human-readable
- unique
- stable after publication where possible

Do not automatically change an existing public slug without considering SEO redirects.

---

## Relationships

Use proper relational constraints.

Examples:

Doctor → Specialty
Doctor → Hospital
Doctor → Chamber
Doctor → Location
Hospital → Location
Diagnostic Center → Location

Use join tables for many-to-many relationships.

Do not duplicate relationship data across multiple tables without a strong reason.

---

## Constraints

Use database-level constraints where appropriate.

Examples:

- unique email
- unique slug
- unique BMDC registration number
- unique provider identifiers
- required foreign keys
- valid relationship constraints

Application validation is required in addition to database constraints.

Do not rely only on application-level validation for uniqueness or integrity.

---

## Indexes

Add indexes based on actual query patterns.

Likely indexed fields include:

- slug
- status
- city
- area/location identifiers
- specialty identifiers
- verification status
- createdAt
- searchable provider identifiers

For composite indexes, base the order on actual filtering/sorting patterns.

Do not create indexes for every column.

Every index has write/storage cost.

---

## Search

Initial search implementation should use PostgreSQL capabilities.

Do not introduce Elasticsearch/OpenSearch for MVP without measurable requirements.

Search implementation should be designed so that a future search-engine migration is possible if scale requires it.

---

## Prisma

Use Prisma as the database access layer.

Keep Prisma schema organized and readable.

Do not put arbitrary business logic inside Prisma schema definitions.

Prefer service/repository functions for reusable database operations.

Avoid scattering raw Prisma queries throughout UI components.

Database access should normally occur through server-side code.

---

## Migrations

Every schema modification must use a Prisma migration.

Development:

```bash
npx prisma migrate dev
```

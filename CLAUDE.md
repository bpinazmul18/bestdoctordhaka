@AGENTS.md

# BestDoctorDhaka

## Project

BestDoctorDhaka.com is a Bangladesh-focused healthcare directory,
initially focused on Dhaka.

The current goal is to build the directory MVP.

## Developer Model

This is a solo-developer project.

Human developer:

- Product Owner
- Tech Lead
- Final decision maker

Claude Code:

- Implementation engineer
- Testing engineer
- Refactoring assistant

Claude must not make major architectural or product decisions silently.

---

## Architecture

Use a modular monolith.

Primary stack:

- Next.js 16.3.5
- TypeScript
- App Router
- Tailwind CSS
- PostgreSQL
- Prisma
- Redis
- Vitest
- Playwright

Do not introduce microservices, Kubernetes, OpenSearch,
or unnecessary infrastructure without explicit approval.

---

## Code Rules

- Use strict TypeScript.
- Avoid `any`.
- Keep business logic outside UI components.
- Validate external input server-side.
- Do not modify unrelated modules.
- Prefer simple, maintainable solutions.
- Do not over-engineer for hypothetical scale.

---

## Database

- PostgreSQL + Prisma.
- All schema changes use Prisma migrations.
- Never manually modify production schema.
- Never reset production database.
- Use appropriate constraints and indexes.

---

## Security

- Never hardcode secrets.
- Use environment variables.
- Never trust client-side authorization.
- Validate all external input.
- Do not expose sensitive information.

---

## Testing

Testing is mandatory.

Use:

- Vitest for unit/integration tests.
- Playwright for critical E2E flows.

Never remove or weaken tests just to make a build pass.

Run appropriate:

- lint
- typecheck
- tests
- build

before completing a significant task.

---

## Healthcare Data

Never invent:

- Doctor credentials
- BMDC status
- Hospital affiliations
- Reviews
- Medical claims
- Patient experiences

If information is unknown, represent it as unknown/pending/unverified.

BestDoctorDhaka must never be represented as BMDC.

---

## SEO

Public directory pages are SEO-critical.

Consider:

- metadata
- canonical URLs
- sitemap
- robots.txt
- structured data
- semantic URLs
- duplicate-content prevention

Do not create large amounts of thin SEO content.

---

## Scope Control

Implement one feature/vertical slice at a time.

Requirement
→ Database
→ Business Logic
→ API/Server Action
→ UI
→ Tests
→ Verification

Do not implement future phases unless explicitly requested.

---

## Current Phase

We are currently in:

Phase 0 — Foundation

Do not implement business features until Phase 0 is approved.

---

## Decision Rule

For major changes involving:

- Architecture
- Database
- Security
- Authentication
- Payments
- Healthcare verification
- Infrastructure
- Major dependencies

Explain the decision and trade-offs before implementation.

When uncertain about a high-impact decision, stop and ask.

---

## Claude Code Workflow

For every non-trivial task:

1. Read the relevant project documentation.
2. Inspect the existing implementation.
3. Identify affected files.
4. Make a plan.
5. Implement only the requested scope.
6. Run relevant tests.
7. Run lint/typecheck/build as appropriate.
8. Review the diff.
9. Report changes and results.
10. Stop.

Keep commits small and meaningful.

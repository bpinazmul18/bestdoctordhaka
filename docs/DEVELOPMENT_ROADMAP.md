# BestDoctorDhaka Development Roadmap

## Development Model
BestDoctorDhaka is a solo-developer project.

Human:
- Product Owner
- Tech Lead
- Final decision maker

Claude Code:
- Implementation engineer
- Testing engineer
- Refactoring assistant
- Documentation assistant

Claude must not make major architectural or product decisions silently.

## Architecture Direction
Use a modular monolith.

Primary stack:
- Next.js
- TypeScript
- App Router
- Tailwind CSS
- PostgreSQL
- Prisma
- Redis
- Vitest
- Playwright
- Husky
- lint-staged

Do not introduce microservices, Kubernetes, OpenSearch, Elasticsearch, or unnecessary infrastructure without approval.

## Phase 0 — Foundation
Goal: establish a clean, testable, maintainable foundation before business features.

Tasks:
- Confirm project structure
- Environment configuration
- PostgreSQL
- Prisma
- Initial database foundation
- Redis for local development
- Vitest
- Integration testing
- Playwright
- Husky
- lint-staged
- Source/module structure
- Documentation structure
- README
- Basic health checks where appropriate
- Verify lint/typecheck/tests/build

Do not implement business features.

## Phase 1 — Doctor Directory
- Specialty
- Location
- Doctor
- Hospital relationship
- Chamber
- Doctor listing/profile
- Basic search/filter

Testing:
- Unit tests
- Integration tests
- Critical doctor-discovery E2E

SEO:
- Metadata
- Semantic URLs
- Canonical strategy
- Structured data where appropriate
- Internal linking

## Phase 2 — Hospital + Diagnostic
Hospital:
- Entity
- Profile/listing
- Services
- Doctor relationships

Diagnostic:
- Entity
- Profile/listing
- Services/tests
- Relationships

Add relevant tests, SEO, sitemap and internal linking.

## Phase 3 — Search + SEO
- Search
- Filters
- Ranking
- Pagination
- Metadata
- Sitemap
- Robots
- Structured data
- Specialty landing pages
- Location landing pages
- Internal linking
- Duplicate-content prevention

Initial search: PostgreSQL capabilities.

Do not introduce OpenSearch/Elasticsearch without measurable need.

## Phase 4 — Trust
- BMDC information
- Verification workflow/history
- Verification states
- Reviews
- Moderation
- Report profile

Never fabricate registration information, reviews, or verification.

## Phase 5 — Authentication + Provider Dashboard
- Authentication
- Roles
- Provider dashboard
- Profile management
- Chamber management
- Basic analytics
- Ownership/authorization

Prioritize authentication, authorization, ownership and security testing.

## Phase 6 — Monetization
- Featured doctors
- Pricing
- Subscription
- Payment integration
- Invoice
- Subscription expiry/state

Use payment abstraction.

Test pricing, subscription state, payment success/failure, expiry and webhooks.

## Phase 7 — Appointments
- Availability
- Time slots
- Appointment requests
- Patient dashboard
- Doctor appointment dashboard
- Notifications
- Payment where appropriate

Test slot availability, double-booking prevention, authorization and state transitions.

## Phase 8 — Production Hardening + Scale
Only as justified by real usage:
- Security hardening
- Performance
- Monitoring
- Backups
- Advanced analytics
- Infrastructure improvements
- CI/CD
- Search scaling

## Feature Development Cycle
Requirement → Database → Validation → Business Logic → API/Server Action → UI → Unit Tests → Integration Tests → E2E where appropriate → Manual Verification → Lint → Typecheck → Build → Review Diff → Commit.

## Scope Control
Do not implement future phases early, refactor unrelated modules, add unnecessary dependencies, or introduce infrastructure without need.

A phase is complete only when functionality, data integrity, tests, lint, typecheck, build and documentation are acceptable.

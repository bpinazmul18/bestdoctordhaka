# Testing Skill — BestDoctorDhaka.com

## Purpose

This skill defines the testing strategy and quality standards for BestDoctorDhaka.com.

Project context:

- Solo developer project
- Modular monolith
- Next.js
- TypeScript
- PostgreSQL
- Prisma

Primary testing tools:

- Vitest — unit and integration tests
- Playwright — end-to-end tests

The goal is reliable, maintainable tests without unnecessary testing complexity.

---

## Core Principles

1. Test behavior, not implementation details.
2. Test business-critical logic first.
3. Prefer fast unit tests where possible.
4. Use integration tests when database or service interaction matters.
5. Use E2E tests only for important user journeys.
6. Every important bug fix should include a regression test where practical.
7. Do not write tests only to increase coverage numbers.
8. Tests must be deterministic and maintainable.
9. Never weaken or delete a test just to make the build pass.
10. Never use production data in tests.

---

# Testing Pyramid

Use the following priority:

1. Unit tests
2. Integration tests
3. E2E tests

General rule:

- Many unit tests
- Appropriate integration tests
- Few but valuable E2E tests

Do not convert every feature into an E2E test.

---

# Unit Tests

Use Vitest for isolated business logic and utilities.

Good candidates:

- validation
- slug generation
- formatting
- filtering
- sorting
- ranking
- pagination calculations
- permission logic
- business rules
- pricing calculations
- subscription calculations
- date/time calculations

Examples:

```text
validateDoctorProfile()
generateSlug()
calculateDoctorRanking()
validateReview()
calculateSubscriptionExpiry()
canEditDoctorProfile()
```

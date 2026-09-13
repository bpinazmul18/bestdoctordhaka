# BestDoctorDhaka Testing Strategy

## Purpose
Testing provides confidence in correctness, security, data integrity and critical user journeys.

Primary tools:
- Vitest
- Playwright

Testing must remain practical for a solo developer.

## Testing Pyramid
```text
Unit tests
    ↓
Integration tests
    ↓
Critical E2E tests
```

Use many focused unit tests, appropriate integration tests, and few high-value E2E tests.

## Unit Tests
Use Vitest for:
- validation
- business rules
- utility functions
- slug generation
- filtering
- sorting
- ranking
- permissions
- pricing
- subscriptions
- date/time logic

Keep unit tests fast and isolated.

## Integration Tests
Use Vitest integration tests for:
- Prisma queries
- repositories
- services
- transactions
- authentication
- authorization
- multi-table workflows

Use a dedicated test database.

## E2E Tests
Use Playwright for critical journeys.

Initial:
```text
Homepage → Doctor listing → Search/filter → Doctor profile
Homepage → Hospital listing → Hospital profile
Homepage → Diagnostic listing → Diagnostic profile
```

Later:
```text
Login → Provider dashboard → Edit profile → Save
Doctor profile → Submit review → Moderation → Published review
Pricing → Checkout → Subscription
Doctor profile → Availability → Appointment → Confirmation
```

Only test features that exist.

## What Not to Test with E2E
Do not use Playwright for:
- utility functions
- validation logic
- calculations
- Prisma queries
- internal helpers
- every component/button

Use unit/integration tests.

## Test Naming
Good:
```ts
it("should reject an invalid BMDC registration number", () => {
  // ...
});
```

Bad:
```ts
it("test doctor", () => {
  // ...
});
```

## Success and Failure Paths
Important functionality should test:
- valid input
- invalid input
- missing data
- duplicate data
- unauthorized access
- forbidden access
- nonexistent resources
- boundary values
- external service failures

## Authentication
Test:
- unauthenticated access
- authenticated access
- invalid credentials
- protected routes
- session behavior
- role permissions

## Authorization
Test allowed and denied behavior.

Examples:
- Doctor can edit own profile.
- Doctor cannot edit another doctor's profile.
- Provider cannot access admin dashboard.
- Admin can manage provider records.

Never rely only on client-side restrictions.

## Healthcare Data Testing
Pay special attention to:
- doctor data
- BMDC information
- verification state
- hospital affiliations
- diagnostic services
- reviews
- provider ownership

## Test Data
Test data must be deterministic, minimal, clearly fake and isolated.

Never use real patient data, sensitive healthcare data, real credentials or production data.

## Mocking
Mock external boundaries when appropriate:
- payment gateway
- email
- SMS
- external APIs
- object storage
- analytics

Avoid excessive mocking.

## External Service Failures
Test both success and failure behavior.

## Regression Testing
For important bugs:
```text
Reproduce → Write failing test → Fix → Test passes → Run related tests
```

## Test Isolation
Tests should be independent whenever possible.

Avoid test-order dependencies and shared mutable state.

## Playwright Stability
Avoid arbitrary sleeps, unnecessary timeouts, fragile selectors and timing-dependent assertions.

Prefer:
```ts
getByRole()
getByLabel()
getByText()
getByPlaceholder()
```

Use stable test IDs when appropriate.

## SEO Testing
Where practical, test:
- title
- meta description
- canonical
- robots
- sitemap
- structured data
- HTTP status
- public URL

## API / Server Action Testing
Test:
- valid request
- invalid request
- unauthenticated request
- forbidden request
- not found
- expected failure behavior

## Coverage
Coverage is a signal, not the objective.

Prioritize:
- authentication
- authorization
- healthcare data integrity
- verification
- reviews
- search/ranking
- subscriptions
- payments
- appointments
- critical business rules

Do not chase arbitrary 100% coverage.

## Local Quality Gate
Use scripts that actually exist in `package.json`.

Typical:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

E2E when relevant:
```bash
npm run test:e2e
```

Inspect `package.json` before assuming scripts exist.

## Pre-Release
```text
Lint
→ Typecheck
→ Unit tests
→ Integration tests
→ Critical E2E tests
→ Production build
```

Do not skip or weaken failing tests without justification.

## Feature Testing Workflow
```text
Requirement
→ Implementation
→ Unit tests
→ Integration tests
→ E2E if critical
→ Manual verification
→ Lint
→ Typecheck
→ Build
```

## Test Organization
Preferred:
```text
src/modules/doctor/
├── doctor.service.ts
├── doctor.service.test.ts
└── doctor.validation.test.ts

tests/e2e/
├── doctors.spec.ts
├── hospitals.spec.ts
└── diagnostics.spec.ts
```

Follow the repository structure once established.

## Definition of Done
A testing task is complete when relevant success/failure/security tests exist, tests are deterministic, existing tests pass, lint/typecheck/build pass, and relevant E2E tests pass.

## Final Priority
Correctness → Security → Data integrity → Critical user journeys → Maintainability → Coverage.

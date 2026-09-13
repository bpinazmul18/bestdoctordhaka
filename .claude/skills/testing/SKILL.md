# Testing Skill — BestDoctorDhaka.com

## Purpose
Define a practical testing strategy for correctness, security, healthcare data integrity, and critical user journeys.

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

Use many focused unit tests, appropriate integration tests, and a small number of high-value E2E tests.

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
- subscription rules
- date/time logic

Tests should be fast and isolated.

## Integration Tests
Use Vitest integration tests for:
- Prisma queries
- repositories
- services
- transactions
- authentication
- authorization
- multi-table workflows
- database constraints

Use a dedicated test database/environment.

## E2E Tests
Use Playwright for critical real-user journeys.

Initial examples:
```text
Homepage → Doctor listing → Search/filter → Doctor profile
Homepage → Hospital listing → Hospital profile
Homepage → Diagnostic listing → Diagnostic profile
```

Later examples only when features exist:
```text
Login → Provider dashboard → Edit profile → Save
Doctor profile → Submit review → Moderation → Published review
Pricing → Checkout → Subscription
Doctor profile → Availability → Appointment → Confirmation
```

Do not test features that do not exist.

## What Not to Test with E2E
Do not use Playwright for:
- utility functions
- validation logic
- calculations
- Prisma query details
- internal helpers
- every component/button

Use unit/integration tests instead.

## Test Naming
Prefer behavior-focused names:
```ts
it("should reject an invalid BMDC registration number", () => {
  // ...
});
```

Avoid vague names such as:
```ts
it("test doctor", () => {
  // ...
});
```

## Success and Failure Paths
Important functionality should cover:
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
Test both allowed and denied behavior.

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

Tests must prevent fabricated or accidentally displayed unverified healthcare data.

## Test Data
Test data must be:
- deterministic
- minimal
- clearly fake
- isolated

Never use:
- real patient data
- sensitive healthcare data
- real credentials
- production data

## Mocking
Mock external boundaries when appropriate:
- payment gateway
- email
- SMS
- external APIs
- object storage
- analytics

Avoid excessive mocking of internal business logic.

## External Service Failures
Test success and failure behavior for external dependencies.

## Regression Testing
For important bugs:
```text
Reproduce
→ Write failing test
→ Fix
→ Test passes
→ Run related tests
```

Do not remove a regression test after fixing the bug.

## Test Isolation
Tests should be independent whenever possible.
Avoid test-order dependencies and shared mutable state.

## Playwright Stability
Avoid:
- arbitrary sleeps
- unnecessary timeouts
- fragile selectors
- timing-dependent assertions

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

Prioritize coverage of:
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
Only use scripts that actually exist in `package.json`.

Typical commands once configured:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Inspect `package.json` before assuming a script exists.

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
→ Review diff
```

## Organization
Preferred module-local tests:
```text
src/modules/doctor/
├── doctor.service.ts
├── doctor.service.test.ts
└── doctor.validation.test.ts
```

Critical E2E tests:
```text
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

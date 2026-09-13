# Doctor Module Skill — BestDoctorDhaka.com

## Purpose
Define the implementation rules for the Doctor directory module. This skill applies when implementing doctors, specialties, locations, hospitals/chambers relationships, doctor listing/profile pages, doctor search/filtering, and related APIs/services.

## Scope
- Doctor entity and lifecycle
- Doctor-specialty relationships
- Doctor-hospital relationships
- Doctor-chamber relationships
- Doctor-location relationships
- Public doctor listing/profile
- Doctor validation and business rules
- Doctor service/repository boundaries
- Doctor API/server actions
- Doctor SEO
- Doctor tests

Do not implement reviews, BMDC verification workflows, payments, subscriptions, appointments, or provider dashboards unless the current roadmap phase explicitly includes them.

## Architecture
Use the modular-monolith pattern:

UI → Server Action/API → Doctor Service → Repository/Prisma → PostgreSQL

Keep business rules in the doctor module, not in React components.

Recommended structure:
```text
src/modules/doctor/
├── doctor.types.ts
├── doctor.validation.ts
├── doctor.service.ts
├── doctor.repository.ts
├── doctor.mapper.ts
├── doctor.constants.ts
├── doctor.service.test.ts
├── doctor.validation.test.ts
└── doctor.repository.test.ts
```

The exact structure may evolve, but ownership must remain clear.

## Data Integrity
Never invent:
- doctor credentials
- BMDC registration numbers
- verification status
- hospital affiliations
- chamber information
- reviews
- medical claims

Unknown information must remain unknown/pending/unverified.

Do not represent BestDoctorDhaka as BMDC or a government verification authority.

## Doctor Data Rules
A public doctor record should have a stable internal ID and an SEO-friendly unique slug.

Typical fields may include:
- name
- slug
- professional title where verified/known
- specialties
- hospital affiliations
- chambers
- locations
- contact information where legitimately sourced
- profile image where available
- status
- createdAt
- updatedAt

Do not add fields merely because they may be useful later. Introduce fields when required by the current feature.

## Validation
Validate all external input server-side.

Validate:
- required fields
- string length
- normalized text
- slug format
- phone/email formats when applicable
- relation identifiers
- pagination parameters
- filters

Reject malformed IDs, invalid pagination, impossible combinations, and unauthorized mutations.

Do not trust client-side validation.

## Slugs
Doctor slugs must be:
- lowercase
- URL-safe
- readable
- unique
- stable after publication

If a published slug changes, preserve SEO through an explicit redirect strategy rather than silently breaking the old URL.

## Relationships
Use explicit foreign keys and join tables where needed.

Examples:
- Doctor ↔ Specialty: many-to-many if multiple specialties are supported.
- Doctor ↔ Hospital: relationship should represent the actual affiliation model.
- Doctor ↔ Chamber: a doctor can have multiple chambers.
- Chamber → Location: location belongs to the chamber/location model rather than duplicating address data unnecessarily.

Do not duplicate the same relationship data in unrelated tables.

## Service Rules
Services should:
- enforce business rules
- coordinate repositories
- normalize inputs where appropriate
- return predictable results
- avoid UI concerns
- avoid leaking Prisma-specific details to callers when a domain result is sufficient

Use transactions when a doctor operation changes multiple related records and partial completion would violate integrity.

## Repository Rules
Repositories should focus on data access and query composition.

Do not put authorization decisions only inside repositories. Authorization belongs in server-side application/service boundaries and must be enforced before mutation.

Avoid unbounded queries. Directory results must be paginated.

Avoid N+1 queries.

## Public Listing
Doctor listing should support only filters that are actually implemented and backed by database query patterns.

Typical filters:
- specialty
- location
- hospital
- status

Use deterministic ordering. Do not claim a ranking methodology that does not exist.

## Public Profile
A doctor profile should:
- return 404 for a nonexistent/unpublished record as appropriate
- expose only public information
- clearly distinguish known vs unverified information
- avoid fabricated claims
- provide useful internal links

Do not expose internal IDs, private provider fields, authentication data, audit data, or sensitive information.

## SEO
Public doctor pages are SEO-critical.

Preferred route:
`/doctors/[slug]`

Implement when the feature phase requires it:
- title
- meta description
- canonical URL
- robots/indexability behavior
- breadcrumb structured data where appropriate
- Doctor/Person structured data only when the data is accurate and appropriate
- internal links to specialty/location/hospital pages

Avoid:
- keyword stuffing
- duplicate doctor pages
- thin generated pages
- fabricated credentials
- fake ratings/reviews

## API / Server Actions
Use Server Actions for suitable internal UI mutations.
Use API routes when an external HTTP boundary or webhook is needed.

Every mutation must verify authentication and authorization server-side when those features exist.

A doctor must never be able to edit another doctor's record merely by changing an ID in a request.

## Testing
Use Vitest for:
- validation
- slug behavior
- filtering
- service business rules
- authorization rules
- edge cases

Use integration tests for:
- Prisma queries
- relationships
- transactions
- pagination
- not-found behavior

Use Playwright only for critical user journeys, for example:
`Homepage → Doctor listing → filter/search → Doctor profile`

Test success and failure paths:
- valid doctor
- missing doctor
- invalid filter
- invalid pagination
- duplicate slug
- unauthorized mutation
- forbidden cross-doctor mutation
- missing relationship
- empty results

## Definition of Done
A Doctor feature is complete only when:
1. Requirement is clear.
2. Data model is correct.
3. Validation exists.
4. Business logic is server-side.
5. API/server action is correct.
6. UI is implemented without business logic leakage.
7. Relevant unit/integration tests pass.
8. Critical E2E coverage exists where appropriate.
9. SEO requirements are handled for public pages.
10. Lint/typecheck/build pass.
11. Diff is reviewed.
12. Documentation is updated when behavior changes.

# SEO Skill — BestDoctorDhaka.com

## Purpose
Define SEO implementation rules for public BestDoctorDhaka pages. SEO is a core acquisition channel, but quality and usefulness take priority over page volume.

## Principles
1. Build for users first.
2. Create indexable pages only when they provide real value.
3. Avoid thin and duplicate pages.
4. Never fabricate healthcare information.
5. Use stable semantic URLs.
6. Use framework-native Next.js metadata and routing.
7. Keep canonical and indexability behavior intentional.

## Public Page Types
Important page types:
- homepage
- doctor profile
- doctor listing
- hospital profile/listing
- diagnostic profile/listing
- specialty page
- location page
- article

Preferred public routes:
```text
/doctors/[slug]
/hospitals/[slug]
/diagnostics/[slug]
/specialties/[slug]
/locations/[slug]
/articles/[slug]
```

## Search Intent
Before creating a page, identify the user's intent and ensure the page answers it.

Examples:
- doctor + specialty
- doctor + location
- hospital discovery
- diagnostic center discovery
- specialty information
- location-based provider discovery
- healthcare educational content

Do not generate large combinations of keywords merely to increase indexed URLs.

## URLs
Use:
- lowercase
- readable slugs
- stable URLs
- meaningful path hierarchy

Avoid exposing database IDs in public URLs.

Do not silently change published URLs.
Use redirects when URL changes are necessary.

## Metadata
Public pages should have intentional:
- title
- meta description
- canonical URL
- robots/indexability behavior where appropriate

Use Next.js metadata APIs.
Do not duplicate identical metadata across large numbers of pages.

## Canonical
Every indexable public page should have a clear canonical URL.

Canonicalize duplicate representations and parameterized variants when they do not represent unique useful content.

## Search / Filter URLs
Be careful with indexability of filter combinations.

Do not allow uncontrolled query parameters to create millions of low-value indexable URLs.

Only index filter/landing pages when they represent a meaningful search intent and contain sufficient unique value.

## Robots and Sitemap
Implement:
- `robots.txt`
- sitemap

Sitemap should include canonical, indexable public pages and exclude private/admin/dashboard routes.

Do not put blocked/private URLs into the sitemap.

## Structured Data
Use structured data only when it accurately represents visible page content and the entity type is appropriate.

Potential types include:
- BreadcrumbList
- appropriate Person/medical professional representations
- Organization/LocalBusiness-related types where appropriate and accurate

Do not use structured data to claim:
- fake credentials
- fake ratings
- fake reviews
- official government verification
- medical superiority

## Internal Linking
Build useful internal links among:
- doctor ↔ specialty
- doctor ↔ location
- doctor ↔ hospital
- hospital ↔ location
- diagnostic ↔ location
- specialty ↔ doctors
- location ↔ providers
- articles ↔ relevant directory pages where editorially appropriate

Do not create artificial link farms.

## Programmatic SEO
Programmatic pages are allowed only when each page has genuine useful content/data.

Avoid:
- empty category pages
- near-duplicate pages
- keyword-stuffed titles
- fabricated descriptions
- thousands of pages with no meaningful provider data

## Healthcare Trust
Healthcare pages require extra care.

Never invent:
- medical claims
- credentials
- BMDC status
- hospital affiliations
- reviews
- patient experiences

Clearly label unknown/unverified information.
BestDoctorDhaka is not BMDC and must not imply government endorsement.

## Performance
SEO implementation should support:
- server rendering where appropriate
- minimal unnecessary client JavaScript
- optimized images
- efficient database queries
- pagination
- sensible caching

Do not sacrifice correctness for speculative performance optimizations.

## Next.js Rules
Prefer Server Components by default.
Use Client Components only when browser APIs or interactivity require them.
Use framework-native metadata, sitemap, and robots APIs where appropriate.

## Testing
Where practical, verify:
- title
- meta description
- canonical
- robots behavior
- sitemap inclusion/exclusion
- structured data
- HTTP status
- public URL
- no accidental `noindex`

## Definition of Done
An SEO-related feature is complete when:
1. Search intent is clear.
2. URL is semantic and stable.
3. Metadata is correct.
4. Canonical behavior is intentional.
5. Indexability is intentional.
6. Structured data is accurate where used.
7. Internal linking is useful.
8. Sitemap/robots behavior is correct where applicable.
9. No thin/duplicate content is introduced.
10. Relevant tests and quality checks pass.

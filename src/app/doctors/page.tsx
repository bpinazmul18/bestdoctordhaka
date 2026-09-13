import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/shared/Button";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { listDoctors } from "@/modules/doctor/doctor.service";
import { parseDoctorListQuery } from "@/modules/doctor/doctor.validation";
import { listSpecialties } from "@/modules/specialty/specialty.service";
import { listLocations } from "@/modules/location/location.service";
import { SITE_URL } from "@/lib/seo/site";

type SearchParams = Record<string, string | string[] | undefined>;

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = await searchParams;
  const query = parseDoctorListQuery(raw);

  const activeFilterCount = [query.specialty, query.location, query.hospital].filter(Boolean).length;
  const isBaseListing = activeFilterCount === 0 && !query.q && query.page === 1;
  const isSingleSpecialtyFilter = Boolean(query.specialty) && activeFilterCount === 1 && !query.q;
  const isSingleLocationFilter = Boolean(query.location) && activeFilterCount === 1 && !query.q;

  let canonical = `${SITE_URL}/doctors`;
  if (isSingleSpecialtyFilter) canonical = `${SITE_URL}/specialties/${query.specialty}`;
  else if (isSingleLocationFilter) canonical = `${SITE_URL}/locations/${query.location}`;

  const hasCleanCanonicalTarget = isBaseListing || isSingleSpecialtyFilter || isSingleLocationFilter;

  return {
    title: "Find Doctors in Dhaka",
    description:
      "Browse doctors in Dhaka by specialty and location on BestDoctorDhaka, a Bangladesh healthcare directory.",
    alternates: { canonical },
    robots: hasCleanCanonicalTarget ? undefined : { index: false, follow: true },
  };
}

export default async function DoctorsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const query = parseDoctorListQuery(raw);
  const [result, specialties, locations] = await Promise.all([
    listDoctors(query),
    listSpecialties(),
    listLocations(),
  ]);

  const hasActiveFilters = Boolean(query.specialty || query.location || query.q);

  function buildHref(page: number): string {
    const params = new URLSearchParams();
    if (query.specialty) params.set("specialty", query.specialty);
    if (query.location) params.set("location", query.location);
    if (query.hospital) params.set("hospital", query.hospital);
    if (query.q) params.set("q", query.q);
    params.set("page", String(page));
    return `/doctors?${params.toString()}`;
  }

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Doctors" }]} />
      <h1 className="mb-6 text-2xl font-bold text-ink sm:text-3xl">Find Doctors in Dhaka</h1>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Filter by</h2>
          <form method="get" className="flex flex-col gap-4">
            {query.hospital && <input type="hidden" name="hospital" value={query.hospital} />}

            <div>
              <label htmlFor="q" className="mb-1 block text-sm font-medium text-ink">
                Search
              </label>
              <input
                id="q"
                type="text"
                name="q"
                defaultValue={query.q ?? ""}
                placeholder="Doctor name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus-visible:border-brand-600"
              />
            </div>

            <div>
              <label htmlFor="specialty" className="mb-1 block text-sm font-medium text-ink">
                Specialty
              </label>
              <select
                id="specialty"
                name="specialty"
                defaultValue={query.specialty ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ink focus-visible:border-brand-600"
              >
                <option value="">All specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty.slug} value={specialty.slug}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="mb-1 block text-sm font-medium text-ink">
                Area in Dhaka
              </label>
              <select
                id="location"
                name="location"
                defaultValue={query.location ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ink focus-visible:border-brand-600"
              >
                <option value="">All areas</option>
                {locations.map((location) => (
                  <option key={location.slug} value={location.slug}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button href="/doctors" variant="ghost" size="sm" className="w-full">
                Clear filters
              </Button>
            )}
          </form>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted">
            {result.totalItems} {result.totalItems === 1 ? "doctor" : "doctors"} found
          </p>

          {result.items.length === 0 ? (
            <EmptyState
              title="No doctors found"
              description="Try adjusting or clearing your filters to see more results."
            />
          ) : (
            <ul className="grid gap-4">
              {result.items.map((doctor) => (
                <DoctorCard key={doctor.slug} doctor={doctor} />
              ))}
            </ul>
          )}

          <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
        </div>
      </div>
    </Container>
  );
}

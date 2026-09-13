import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { listDoctors } from "@/modules/doctor/doctor.service";
import { parseDoctorListQuery } from "@/modules/doctor/doctor.validation";
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
  const result = await listDoctors(query);

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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Doctors" }]} />
      <h1 className="mb-4 text-2xl font-semibold">Find Doctors in Dhaka</h1>

      <form method="get" className="mb-6 flex flex-wrap gap-2">
        {query.specialty && <input type="hidden" name="specialty" value={query.specialty} />}
        {query.location && <input type="hidden" name="location" value={query.location} />}
        {query.hospital && <input type="hidden" name="hospital" value={query.hospital} />}
        <input
          type="text"
          name="q"
          defaultValue={query.q ?? ""}
          placeholder="Search by doctor name"
          className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        />
        <button
          type="submit"
          className="rounded border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Search
        </button>
      </form>

      {result.items.length === 0 ? (
        <p className="text-zinc-500">No doctors found for the selected filters.</p>
      ) : (
        <ul className="grid gap-4">
          {result.items.map((doctor) => (
            <DoctorCard key={doctor.slug} doctor={doctor} />
          ))}
        </ul>
      )}

      <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
    </div>
  );
}

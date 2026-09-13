import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/shared/Button";
import { ArrowRightIcon } from "@/components/shared/icons";
import { listHospitals } from "@/modules/hospital/hospital.service";
import { parseHospitalListQuery } from "@/modules/hospital/hospital.validation";
import { listLocations } from "@/modules/location/location.service";
import { SITE_URL } from "@/lib/seo/site";

type SearchParams = Record<string, string | string[] | undefined>;

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = await searchParams;
  const query = parseHospitalListQuery(raw);
  const isBaseListing = !query.location && query.page === 1;

  return {
    title: "Hospitals in Dhaka",
    description: "Browse hospitals and clinics in Dhaka on BestDoctorDhaka.",
    alternates: { canonical: `${SITE_URL}/hospitals` },
    robots: isBaseListing ? undefined : { index: false, follow: true },
  };
}

export default async function HospitalsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const query = parseHospitalListQuery(raw);
  const [result, locations] = await Promise.all([listHospitals(query), listLocations()]);

  function buildHref(page: number): string {
    const params = new URLSearchParams();
    if (query.location) params.set("location", query.location);
    params.set("page", String(page));
    return `/hospitals?${params.toString()}`;
  }

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Hospitals" }]} />
      <h1 className="mb-6 text-2xl font-bold text-ink sm:text-3xl">Hospitals in Dhaka</h1>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Filter by</h2>
          <form method="get" className="flex flex-col gap-4">
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
              Apply Filter
            </Button>
            {query.location && (
              <Button href="/hospitals" variant="ghost" size="sm" className="w-full">
                Clear filter
              </Button>
            )}
          </form>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted">
            {result.totalItems} {result.totalItems === 1 ? "hospital" : "hospitals"} found
          </p>

          {result.items.length === 0 ? (
            <EmptyState title="No hospitals found" description="Try clearing your filter to see more results." />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((hospital) => (
                <li key={hospital.slug}>
                  <Link
                    href={`/hospitals/${hospital.slug}`}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">{hospital.name}</span>
                      <span className="block truncate text-sm text-muted">
                        {hospital.location.name}, {hospital.location.city}
                      </span>
                    </span>
                    <ArrowRightIcon width={16} height={16} className="shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
        </div>
      </div>
    </Container>
  );
}

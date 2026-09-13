import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/shared/Button";
import { ArrowRightIcon } from "@/components/shared/icons";
import { listDiagnosticCenters } from "@/modules/diagnostic-center/diagnostic-center.service";
import { parseDiagnosticCenterListQuery } from "@/modules/diagnostic-center/diagnostic-center.validation";
import { listLocations } from "@/modules/location/location.service";
import { listDiagnosticTests } from "@/modules/diagnostic-test/diagnostic-test.service";
import { SITE_URL } from "@/lib/seo/site";

type SearchParams = Record<string, string | string[] | undefined>;

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = await searchParams;
  const query = parseDiagnosticCenterListQuery(raw);
  const isBaseListing = !query.location && !query.test && query.page === 1;

  return {
    title: "Diagnostic Centers in Dhaka",
    description: "Browse diagnostic centers and testing labs in Dhaka on BestDoctorDhaka.",
    alternates: { canonical: `${SITE_URL}/diagnostic-centers` },
    robots: isBaseListing ? undefined : { index: false, follow: true },
  };
}

export default async function DiagnosticCentersPage({ searchParams }: Props) {
  const raw = await searchParams;
  const query = parseDiagnosticCenterListQuery(raw);
  const [result, locations, tests] = await Promise.all([
    listDiagnosticCenters(query),
    listLocations(),
    listDiagnosticTests(),
  ]);

  function buildHref(page: number): string {
    const params = new URLSearchParams();
    if (query.location) params.set("location", query.location);
    if (query.test) params.set("test", query.test);
    params.set("page", String(page));
    return `/diagnostic-centers?${params.toString()}`;
  }

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Diagnostic Centers" }]} />
      <h1 className="mb-6 text-2xl font-bold text-ink sm:text-3xl">Diagnostic Centers in Dhaka</h1>

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

            <div>
              <label htmlFor="test" className="mb-1 block text-sm font-medium text-ink">
                Test / Service
              </label>
              <select
                id="test"
                name="test"
                defaultValue={query.test ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ink focus-visible:border-brand-600"
              >
                <option value="">All tests</option>
                {tests.map((test) => (
                  <option key={test.slug} value={test.slug}>
                    {test.name}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
            {(query.location || query.test) && (
              <Button href="/diagnostic-centers" variant="ghost" size="sm" className="w-full">
                Clear filters
              </Button>
            )}
          </form>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted">
            {result.totalItems} {result.totalItems === 1 ? "diagnostic center" : "diagnostic centers"} found
          </p>

          {result.items.length === 0 ? (
            <EmptyState
              title="No diagnostic centers found"
              description="Try adjusting or clearing your filters to see more results."
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((center) => (
                <li key={center.slug}>
                  <Link
                    href={`/diagnostic-centers/${center.slug}`}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">{center.name}</span>
                      <span className="block truncate text-sm text-muted">
                        {center.location.name}, {center.location.city}
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

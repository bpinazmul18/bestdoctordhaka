import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { getLocationBySlug } from "@/modules/location/location.service";
import { listDoctors } from "@/modules/doctor/doctor.service";
import { parseDoctorListQuery } from "@/modules/doctor/doctor.validation";
import { SITE_URL } from "@/lib/seo/site";

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) return {};

  return {
    title: `Doctors in ${location.name}, ${location.city}`,
    description: `Find doctors with chambers in ${location.name}, ${location.city} on BestDoctorDhaka.`,
    alternates: { canonical: `${SITE_URL}/locations/${location.slug}` },
  };
}

export default async function LocationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const rawQuery = await searchParams;
  const query = parseDoctorListQuery({ ...rawQuery, location: location.slug });
  const result = await listDoctors(query);

  function buildHref(page: number): string {
    return `/locations/${slug}?page=${page}`;
  }

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations" },
          { label: location.name },
        ]}
      />
      <h1 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">
        Doctors in {location.name}, {location.city}
      </h1>
      <p className="mb-6 text-sm text-muted">
        {result.totalItems} {result.totalItems === 1 ? "doctor" : "doctors"} found
      </p>

      {result.items.length === 0 ? (
        <EmptyState
          title="No published doctors with a chamber in this area yet"
          description="Check back soon, or browse another area."
        />
      ) : (
        <ul className="grid gap-4">
          {result.items.map((doctor) => (
            <DoctorCard key={doctor.slug} doctor={doctor} />
          ))}
        </ul>
      )}

      <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
    </Container>
  );
}

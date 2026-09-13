import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { getHospitalBySlug } from "@/modules/hospital/hospital.service";
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
  const hospital = await getHospitalBySlug(slug);
  if (!hospital) return {};

  return {
    title: `Doctors at ${hospital.name}`,
    description: `Find doctors affiliated with ${hospital.name} in ${hospital.location.name}, ${hospital.location.city} on BestDoctorDhaka.`,
    alternates: { canonical: `${SITE_URL}/hospitals/${hospital.slug}` },
  };
}

export default async function HospitalPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const hospital = await getHospitalBySlug(slug);
  if (!hospital) notFound();

  const rawQuery = await searchParams;
  const query = parseDoctorListQuery({ ...rawQuery, hospital: hospital.slug });
  const result = await listDoctors(query);

  function buildHref(page: number): string {
    return `/hospitals/${slug}?page=${page}`;
  }

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Hospitals", href: "/hospitals" },
          { label: hospital.name },
        ]}
      />
      <h1 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">{hospital.name}</h1>
      <p className="mb-2 text-muted">
        {hospital.location.name}, {hospital.location.city}
      </p>
      <p className="mb-6 text-sm text-muted">
        {result.totalItems} {result.totalItems === 1 ? "doctor" : "doctors"} found
      </p>

      {result.items.length === 0 ? (
        <EmptyState
          title="No published doctors for this hospital yet"
          description="Check back soon, or browse another hospital."
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { getSpecialtyBySlug } from "@/modules/specialty/specialty.service";
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
  const specialty = await getSpecialtyBySlug(slug);
  if (!specialty) return {};

  return {
    title: `${specialty.name} Doctors in Dhaka`,
    description:
      specialty.description ??
      `Find doctors specializing in ${specialty.name} in Dhaka on BestDoctorDhaka.`,
    alternates: { canonical: `${SITE_URL}/specialties/${specialty.slug}` },
  };
}

export default async function SpecialtyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const specialty = await getSpecialtyBySlug(slug);
  if (!specialty) notFound();

  const rawQuery = await searchParams;
  const query = parseDoctorListQuery({ ...rawQuery, specialty: specialty.slug });
  const result = await listDoctors(query);

  function buildHref(page: number): string {
    return `/specialties/${slug}?page=${page}`;
  }

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Specialties", href: "/specialties" },
          { label: specialty.name },
        ]}
      />
      <h1 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">{specialty.name} Doctors in Dhaka</h1>
      {specialty.description && <p className="mb-2 text-muted">{specialty.description}</p>}
      <p className="mb-6 text-sm text-muted">
        {result.totalItems} {result.totalItems === 1 ? "doctor" : "doctors"} found
      </p>

      {result.items.length === 0 ? (
        <EmptyState
          title="No published doctors for this specialty yet"
          description="Check back soon, or browse another specialty."
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

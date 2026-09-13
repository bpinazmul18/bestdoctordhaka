import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { SpecialtyIcon } from "@/components/shared/SpecialtyIcon";
import { ArrowRightIcon } from "@/components/shared/icons";
import { listSpecialties } from "@/modules/specialty/specialty.service";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Medical Specialties",
  description: "Browse doctors in Dhaka by medical specialty on BestDoctorDhaka.",
  alternates: { canonical: `${SITE_URL}/specialties` },
};

export default async function SpecialtiesPage() {
  const specialties = await listSpecialties();

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Specialties" }]} />
      <h1 className="mb-6 text-2xl font-bold text-ink sm:text-3xl">Medical Specialties</h1>

      {specialties.length === 0 ? (
        <EmptyState title="No specialties available yet" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((specialty) => (
            <li key={specialty.slug}>
              <Link
                href={`/specialties/${specialty.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <SpecialtyIcon slug={specialty.slug} width={22} height={22} className="shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink">{specialty.name}</span>
                  {specialty.description && (
                    <span className="block truncate text-sm text-muted">{specialty.description}</span>
                  )}
                </span>
                <ArrowRightIcon width={16} height={16} className="shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

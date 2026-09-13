import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { getDiagnosticCenterBySlug } from "@/modules/diagnostic-center/diagnostic-center.service";
import { SITE_URL } from "@/lib/seo/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const center = await getDiagnosticCenterBySlug(slug);
  if (!center) return {};

  return {
    title: center.name,
    description: `${center.name} is a diagnostic center in ${center.location.name}, ${center.location.city} on BestDoctorDhaka.`,
    alternates: { canonical: `${SITE_URL}/diagnostic-centers/${center.slug}` },
  };
}

export default async function DiagnosticCenterPage({ params }: Props) {
  const { slug } = await params;
  const center = await getDiagnosticCenterBySlug(slug);
  if (!center) notFound();

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Diagnostic Centers", href: "/diagnostic-centers" },
          { label: center.name },
        ]}
      />
      <h1 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">{center.name}</h1>
      <p className="mb-6 text-muted">
        <Link href={`/locations/${center.location.slug}`} className="hover:text-brand-700 hover:underline">
          {center.location.name}, {center.location.city}
        </Link>
      </p>

      <h2 className="mb-3 text-lg font-semibold text-ink">Tests &amp; Services</h2>
      {center.tests.length === 0 ? (
        <EmptyState title="No tests listed for this center yet" description="Check back soon for updates." />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {center.tests.map((test) => (
            <li
              key={test.slug}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-ink"
            >
              {test.name}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

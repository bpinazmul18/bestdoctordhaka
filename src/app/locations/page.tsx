import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { MapPinIcon, ArrowRightIcon } from "@/components/shared/icons";
import { listLocations } from "@/modules/location/location.service";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Locations",
  description: "Browse doctors in Dhaka by area on BestDoctorDhaka.",
  alternates: { canonical: `${SITE_URL}/locations` },
};

export default async function LocationsPage() {
  const locations = await listLocations();

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations" }]} />
      <h1 className="mb-6 text-2xl font-bold text-ink sm:text-3xl">Locations</h1>

      {locations.length === 0 ? (
        <EmptyState title="No locations available yet" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <li key={location.slug}>
              <Link
                href={`/locations/${location.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <MapPinIcon width={20} height={20} className="shrink-0 text-brand-600" />
                <span className="flex-1 font-medium text-ink">
                  {location.name}, {location.city}
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

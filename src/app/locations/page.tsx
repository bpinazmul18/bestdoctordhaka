import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations" }]} />
      <h1 className="mb-4 text-2xl font-semibold">Locations</h1>

      {locations.length === 0 ? (
        <p className="text-zinc-500">No locations available yet.</p>
      ) : (
        <ul className="grid gap-2">
          {locations.map((location) => (
            <li key={location.slug}>
              <Link href={`/locations/${location.slug}`} className="hover:underline">
                {location.name}, {location.city}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

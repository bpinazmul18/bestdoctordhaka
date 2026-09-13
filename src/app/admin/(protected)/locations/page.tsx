import type { Metadata } from "next";
import { listLocations } from "@/modules/location/location.service";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Locations" };

export default async function AdminLocationsPage() {
  const locations = await listLocations();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Locations</h1>
        <Button href="/admin/locations/new">Add Location</Button>
      </div>

      {locations.length === 0 ? (
        <EmptyState title="No locations yet" description="Add the first location to unlock hospitals, diagnostic centers, and doctor chambers." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Slug</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.slug} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-ink">{location.name}</td>
                  <td className="px-4 py-3 text-muted">{location.city}</td>
                  <td className="px-4 py-3 text-muted">{location.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

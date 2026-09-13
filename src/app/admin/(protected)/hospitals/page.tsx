import type { Metadata } from "next";
import { listHospitals } from "@/modules/hospital/hospital.service";
import { MAX_PAGE_SIZE } from "@/lib/pagination/pagination";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Hospitals" };

export default async function AdminHospitalsPage() {
  const { items: hospitals } = await listHospitals({ page: 1, pageSize: MAX_PAGE_SIZE });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Hospitals</h1>
        <Button href="/admin/hospitals/new">Add Hospital</Button>
      </div>

      {hospitals.length === 0 ? (
        <EmptyState title="No hospitals yet" description="Add the first hospital so doctors can be affiliated with it." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Slug</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map((hospital) => (
                <tr key={hospital.slug} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-ink">{hospital.name}</td>
                  <td className="px-4 py-3 text-muted">
                    {hospital.location.name}, {hospital.location.city}
                  </td>
                  <td className="px-4 py-3 text-muted">{hospital.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

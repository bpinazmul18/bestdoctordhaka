import type { Metadata } from "next";
import { listDoctors } from "@/modules/doctor/doctor.service";
import { MAX_PAGE_SIZE } from "@/lib/pagination/pagination";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Doctors" };

export default async function AdminDoctorsPage() {
  const { items: doctors } = await listDoctors({ page: 1, pageSize: MAX_PAGE_SIZE });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Doctors</h1>
        <Button href="/admin/doctors/new">Add Doctor</Button>
      </div>

      <p className="mb-4 text-sm text-muted">Showing published doctors only.</p>

      {doctors.length === 0 ? (
        <EmptyState title="No published doctors yet" description="Add the first doctor to the directory." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Specialty</th>
                <th className="px-4 py-3 font-medium">Slug</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.slug} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-ink">{doctor.fullName}</td>
                  <td className="px-4 py-3 text-muted">{doctor.primarySpecialty.name}</td>
                  <td className="px-4 py-3 text-muted">{doctor.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

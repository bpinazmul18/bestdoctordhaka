import type { Metadata } from "next";
import { listSpecialties } from "@/modules/specialty/specialty.service";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Specialties" };

export default async function AdminSpecialtiesPage() {
  const specialties = await listSpecialties();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Specialties</h1>
        <Button href="/admin/specialties/new">Add Specialty</Button>
      </div>

      {specialties.length === 0 ? (
        <EmptyState title="No specialties yet" description="Add the first specialty so doctors can be assigned to it." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Slug</th>
              </tr>
            </thead>
            <tbody>
              {specialties.map((specialty) => (
                <tr key={specialty.slug} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-ink">{specialty.name}</td>
                  <td className="px-4 py-3 text-muted">{specialty.description ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{specialty.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

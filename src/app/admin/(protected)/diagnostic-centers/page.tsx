import type { Metadata } from "next";
import { listDiagnosticCenters } from "@/modules/diagnostic-center/diagnostic-center.service";
import { MAX_PAGE_SIZE } from "@/lib/pagination/pagination";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Diagnostic Centers" };

export default async function AdminDiagnosticCentersPage() {
  const { items: centers } = await listDiagnosticCenters({ page: 1, pageSize: MAX_PAGE_SIZE });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Diagnostic Centers</h1>
        <Button href="/admin/diagnostic-centers/new">Add Diagnostic Center</Button>
      </div>

      {centers.length === 0 ? (
        <EmptyState title="No diagnostic centers yet" description="Add the first diagnostic center." />
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
              {centers.map((center) => (
                <tr key={center.slug} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-ink">{center.name}</td>
                  <td className="px-4 py-3 text-muted">
                    {center.location.name}, {center.location.city}
                  </td>
                  <td className="px-4 py-3 text-muted">{center.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

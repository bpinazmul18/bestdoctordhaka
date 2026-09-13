import type { Metadata } from "next";
import { listLocationOptions } from "@/modules/location/location.service";
import { listDiagnosticTestOptions } from "@/modules/diagnostic-test/diagnostic-test.service";
import { DiagnosticCenterForm } from "./DiagnosticCenterForm";

export const metadata: Metadata = { title: "Add Diagnostic Center" };

export default async function NewDiagnosticCenterPage() {
  const [locations, tests] = await Promise.all([listLocationOptions(), listDiagnosticTestOptions()]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Add Diagnostic Center</h1>
      <DiagnosticCenterForm locations={locations} tests={tests} />
    </div>
  );
}

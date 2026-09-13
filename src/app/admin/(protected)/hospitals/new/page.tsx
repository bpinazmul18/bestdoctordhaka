import type { Metadata } from "next";
import { listLocationOptions } from "@/modules/location/location.service";
import { HospitalForm } from "./HospitalForm";

export const metadata: Metadata = { title: "Add Hospital" };

export default async function NewHospitalPage() {
  const locations = await listLocationOptions();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Add Hospital</h1>
      <HospitalForm locations={locations} />
    </div>
  );
}

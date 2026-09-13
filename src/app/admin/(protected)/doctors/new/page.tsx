import type { Metadata } from "next";
import { listSpecialtyOptions } from "@/modules/specialty/specialty.service";
import { listHospitalOptions } from "@/modules/hospital/hospital.service";
import { DoctorForm } from "./DoctorForm";

export const metadata: Metadata = { title: "Add Doctor" };

export default async function NewDoctorPage() {
  const [specialties, hospitals] = await Promise.all([listSpecialtyOptions(), listHospitalOptions()]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Add Doctor</h1>
      <DoctorForm specialties={specialties} hospitals={hospitals} />
    </div>
  );
}

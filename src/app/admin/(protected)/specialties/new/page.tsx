import type { Metadata } from "next";
import { SpecialtyForm } from "./SpecialtyForm";

export const metadata: Metadata = { title: "Add Specialty" };

export default function NewSpecialtyPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Add Specialty</h1>
      <SpecialtyForm />
    </div>
  );
}

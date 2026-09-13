import type { Metadata } from "next";
import { LocationForm } from "./LocationForm";

export const metadata: Metadata = { title: "Add Location" };

export default function NewLocationPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Add Location</h1>
      <LocationForm />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { listSpecialties } from "@/modules/specialty/specialty.service";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Medical Specialties",
  description: "Browse doctors in Dhaka by medical specialty on BestDoctorDhaka.",
  alternates: { canonical: `${SITE_URL}/specialties` },
};

export default async function SpecialtiesPage() {
  const specialties = await listSpecialties();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Specialties" }]} />
      <h1 className="mb-4 text-2xl font-semibold">Medical Specialties</h1>

      {specialties.length === 0 ? (
        <p className="text-zinc-500">No specialties available yet.</p>
      ) : (
        <ul className="grid gap-2">
          {specialties.map((specialty) => (
            <li key={specialty.slug}>
              <Link href={`/specialties/${specialty.slug}`} className="hover:underline">
                {specialty.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

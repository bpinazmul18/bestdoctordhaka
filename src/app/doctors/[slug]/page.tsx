import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getDoctorProfile } from "@/modules/doctor/doctor.service";
import { SITE_URL } from "@/lib/seo/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorProfile(slug);
  if (!doctor) return {};

  const titleSuffix = doctor.degrees ? `, ${doctor.degrees}` : "";
  const title = `${doctor.fullName}${titleSuffix} — ${doctor.primarySpecialty.name}`;
  const description = `${doctor.fullName}${titleSuffix} — ${doctor.primarySpecialty.name} in Dhaka. View chamber details and contact information on BestDoctorDhaka.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/doctors/${doctor.slug}` },
  };
}

export default async function DoctorProfilePage({ params }: Props) {
  const { slug } = await params;
  const doctor = await getDoctorProfile(slug);
  if (!doctor) notFound();

  const firstChamber = doctor.chambers[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.fullName,
    medicalSpecialty: doctor.primarySpecialty.name,
    ...(firstChamber
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: firstChamber.addressLine,
            addressLocality: firstChamber.location.name,
            addressRegion: firstChamber.location.city,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: doctor.primarySpecialty.name, href: `/specialties/${doctor.primarySpecialty.slug}` },
          { label: doctor.fullName },
        ]}
      />

      <h1 className="text-2xl font-semibold">{doctor.fullName}</h1>
      {doctor.degrees && <p className="text-zinc-500">{doctor.degrees}</p>}
      {doctor.designation && <p className="text-zinc-500">{doctor.designation}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {doctor.specialties.map((specialty) => (
          <Link
            key={specialty.slug}
            href={`/specialties/${specialty.slug}`}
            className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:underline dark:border-zinc-700"
          >
            {specialty.name}
          </Link>
        ))}
      </div>

      {doctor.shortBio && <p className="mt-4">{doctor.shortBio}</p>}

      {doctor.hospitalNames.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Hospital Affiliations</h2>
          <ul className="list-inside list-disc text-zinc-600 dark:text-zinc-400">
            {doctor.hospitalNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      )}

      {doctor.chambers.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Chambers</h2>
          <ul className="mt-2 grid gap-4">
            {doctor.chambers.map((chamber, index) => (
              // Chambers have no public identifier of their own in Phase 1.
              <li key={index} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                {chamber.name && <p className="font-medium">{chamber.name}</p>}
                <p>{chamber.addressLine}</p>
                <p>
                  <Link href={`/locations/${chamber.location.slug}`} className="hover:underline">
                    {chamber.location.name}, {chamber.location.city}
                  </Link>
                </p>
                {chamber.hospitalName && <p className="text-zinc-500">{chamber.hospitalName}</p>}
                {chamber.contactPhone && <p>Phone: {chamber.contactPhone}</p>}
                {chamber.whatsappNumber && <p>WhatsApp: {chamber.whatsappNumber}</p>}
                {chamber.visitingHoursNote && (
                  <p className="text-zinc-500">{chamber.visitingHoursNote}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

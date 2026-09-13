import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { MapPinIcon, ClockIcon, PhoneIcon, WhatsAppIcon } from "@/components/shared/icons";
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
  const primaryPhone = doctor.chambers.find((chamber) => chamber.contactPhone)?.contactPhone;

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
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: doctor.primarySpecialty.name, href: `/specialties/${doctor.primarySpecialty.slug}` },
          { label: doctor.fullName },
        ]}
      />

      <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:p-8">
        {doctor.profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs, not part of next/image's configured domains
          <img
            src={doctor.profileImageUrl}
            alt=""
            className="h-32 w-32 shrink-0 rounded-2xl object-cover sm:h-40 sm:w-40"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl font-semibold text-brand-700 sm:h-40 sm:w-40"
          >
            {doctor.fullName
              .replace(/^(Dr\.?|Prof\.?)\s+/i, "")
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("")}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{doctor.fullName}</h1>
          {doctor.degrees && <p className="mt-1 text-muted">{doctor.degrees}</p>}
          {doctor.designation && <p className="text-muted">{doctor.designation}</p>}

          <p className="mt-2 text-sm font-medium text-brand-700">{doctor.primarySpecialty.name}</p>

          <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
            {firstChamber && (
              <span className="flex items-center gap-1.5">
                <MapPinIcon width={16} height={16} className="shrink-0" />
                <Link href={`/locations/${firstChamber.location.slug}`} className="hover:text-brand-700 hover:underline">
                  {firstChamber.location.name}, {firstChamber.location.city}
                </Link>
              </span>
            )}
            {doctor.yearsOfExperience !== null && (
              <span className="flex items-center gap-1.5">
                <ClockIcon width={16} height={16} className="shrink-0" />
                {doctor.yearsOfExperience}+ years experience
              </span>
            )}
          </div>

          {primaryPhone && (
            <div className="mt-5">
              <Button href={`tel:${primaryPhone}`} variant="primary">
                <PhoneIcon width={16} height={16} />
                Call Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {doctor.shortBio && (
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-bold text-ink">About</h2>
          <p className="leading-relaxed text-slate-700">{doctor.shortBio}</p>
        </section>
      )}

      {doctor.specialties.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-ink">Specialization</h2>
          <div className="flex flex-wrap gap-2">
            {doctor.specialties.map((specialty) => (
              <Link key={specialty.slug} href={`/specialties/${specialty.slug}`}>
                <Badge>{specialty.name}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {doctor.hospitalNames.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-ink">Hospital Affiliations</h2>
          <ul className="list-inside list-disc space-y-1 text-slate-700">
            {doctor.hospitalNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      )}

      {doctor.chambers.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-ink">Chamber &amp; Visiting Hours</h2>
          <ul className="grid gap-4">
            {doctor.chambers.map((chamber, index) => (
              // Chambers have no public identifier of their own in Phase 1.
              <li key={index} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {chamber.name && <p className="font-semibold text-ink">{chamber.name}</p>}
                    {chamber.hospitalName && <p className="text-sm text-muted">{chamber.hospitalName}</p>}
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                      <MapPinIcon width={15} height={15} className="shrink-0 text-muted" />
                      {chamber.addressLine},{" "}
                      <Link href={`/locations/${chamber.location.slug}`} className="text-brand-700 hover:underline">
                        {chamber.location.name}, {chamber.location.city}
                      </Link>
                    </p>
                    {chamber.visitingHoursNote && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                        <ClockIcon width={15} height={15} className="shrink-0" />
                        {chamber.visitingHoursNote}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {chamber.contactPhone && (
                      <Button href={`tel:${chamber.contactPhone}`} variant="outline" size="sm">
                        <PhoneIcon width={14} height={14} />
                        Call
                      </Button>
                    )}
                    {chamber.whatsappNumber && (
                      <Button
                        href={`https://wa.me/${chamber.whatsappNumber.replace(/\D/g, "")}`}
                        variant="outline"
                        size="sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon width={14} height={14} />
                        WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Container>
  );
}

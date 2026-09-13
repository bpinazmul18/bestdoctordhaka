import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  WhatsAppIcon,
  CheckIcon,
  GraduationCapIcon,
} from "@/components/shared/icons";
import { getDoctorProfile } from "@/modules/doctor/doctor.service";
import type { ChamberDTO, DoctorProfileDTO } from "@/modules/doctor/doctor.types";
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

function googleMapsUrl(chamber: ChamberDTO): string {
  const query = [chamber.addressLine, chamber.location.name, chamber.location.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function QuickInfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function OverviewSection({ doctor }: { doctor: DoctorProfileDTO }) {
  return (
    <div className="flex flex-col gap-6">
      {doctor.shortBio && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink">About</h3>
          <p className="leading-relaxed text-slate-700">{doctor.shortBio}</p>
        </div>
      )}

      {doctor.specialties.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Specialization</h3>
          <div className="flex flex-wrap gap-2">
            {doctor.specialties.map((specialty) => (
              <Link key={specialty.slug} href={`/specialties/${specialty.slug}`}>
                <Badge>{specialty.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {doctor.hospitalNames.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Hospital Affiliations</h3>
          <ul className="list-inside list-disc space-y-1 text-slate-700">
            {doctor.hospitalNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ChambersSection({ doctor }: { doctor: DoctorProfileDTO }) {
  return (
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
              <a
                href={googleMapsUrl(chamber)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline"
              >
                View on Google Maps
              </a>
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
  );
}

function ConditionsSection({ doctor }: { doctor: DoctorProfileDTO }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {doctor.conditionsTreated.map((condition) => (
        <div key={condition} className="flex items-center gap-2 text-sm text-slate-700">
          <CheckIcon width={16} height={16} className="shrink-0 text-brand-700" />
          {condition}
        </div>
      ))}
    </div>
  );
}

function EducationSection({ doctor }: { doctor: DoctorProfileDTO }) {
  return (
    <div className="flex flex-col gap-6">
      {doctor.degrees && (
        <div className="flex items-start gap-3">
          <GraduationCapIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-ink">Degrees</p>
            <p className="text-sm text-slate-700">{doctor.degrees}</p>
          </div>
        </div>
      )}

      {doctor.designation && (
        <div className="flex items-start gap-3">
          <GraduationCapIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-ink">Designation</p>
            <p className="text-sm text-slate-700">{doctor.designation}</p>
          </div>
        </div>
      )}

      {doctor.yearsOfExperience !== null && (
        <div className="flex items-start gap-3">
          <ClockIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-ink">Experience</p>
            <p className="text-sm text-slate-700">{doctor.yearsOfExperience}+ years</p>
          </div>
        </div>
      )}

      {doctor.specialties.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {doctor.specialties.map((specialty) => (
              <Badge key={specialty.slug}>{specialty.name}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function DoctorProfilePage({ params }: Props) {
  const { slug } = await params;
  const doctor = await getDoctorProfile(slug);
  if (!doctor) notFound();

  const firstChamber = doctor.chambers[0];
  const primaryPhone = doctor.chambers.find((chamber) => chamber.contactPhone)?.contactPhone;
  const primaryWhatsapp = doctor.chambers.find((chamber) => chamber.whatsappNumber)?.whatsappNumber;
  const workplace = doctor.hospitalNames[0] ?? firstChamber?.hospitalName ?? null;

  const hasOverview = Boolean(doctor.shortBio) || doctor.specialties.length > 0 || doctor.hospitalNames.length > 0;
  const hasEducation =
    Boolean(doctor.degrees) ||
    Boolean(doctor.designation) ||
    doctor.yearsOfExperience !== null ||
    doctor.specialties.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.fullName,
    medicalSpecialty: doctor.primarySpecialty.name,
    ...(doctor.conditionsTreated.length > 0 ? { knowsAbout: doctor.conditionsTreated } : {}),
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
            {workplace && (
              <span className="flex items-center gap-1.5">
                <MapPinIcon width={16} height={16} className="shrink-0" />
                {workplace}
              </span>
            )}
            {doctor.yearsOfExperience !== null && (
              <span className="flex items-center gap-1.5">
                <ClockIcon width={16} height={16} className="shrink-0" />
                {doctor.yearsOfExperience}+ years experience
              </span>
            )}
          </div>

          {(primaryPhone || primaryWhatsapp) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {primaryPhone && (
                <Button href={`tel:${primaryPhone}`} variant="primary">
                  <PhoneIcon width={16} height={16} />
                  Call Now
                </Button>
              )}
              {primaryWhatsapp && (
                <Button
                  href={`https://wa.me/${primaryWhatsapp.replace(/\D/g, "")}`}
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon width={16} height={16} />
                  WhatsApp
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          {hasOverview && (
            <ProfileSection title="Overview">
              <OverviewSection doctor={doctor} />
            </ProfileSection>
          )}

          {doctor.chambers.length > 0 && (
            <ProfileSection title="Chamber & Appointment">
              <ChambersSection doctor={doctor} />
            </ProfileSection>
          )}

          {doctor.conditionsTreated.length > 0 && (
            <ProfileSection title="Conditions Treated">
              <ConditionsSection doctor={doctor} />
            </ProfileSection>
          )}

          {hasEducation && (
            <ProfileSection title="Education & Experience">
              <EducationSection doctor={doctor} />
            </ProfileSection>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">Quick Information</h2>
          <div className="divide-y divide-slate-100">
            <QuickInfoRow label="Specialty" value={doctor.primarySpecialty.name} />
            {doctor.designation && <QuickInfoRow label="Designation" value={doctor.designation} />}
            {workplace && <QuickInfoRow label="Workplace" value={workplace} />}
            {doctor.yearsOfExperience !== null && (
              <QuickInfoRow label="Experience" value={`${doctor.yearsOfExperience}+ yrs`} />
            )}
            <QuickInfoRow
              label="Chamber"
              value={doctor.chambers.length > 0 ? `${doctor.chambers.length} Chamber${doctor.chambers.length > 1 ? "s" : ""}` : "—"}
            />
            {primaryPhone && <QuickInfoRow label="Phone" value={primaryPhone} />}
          </div>
        </aside>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Container>
  );
}

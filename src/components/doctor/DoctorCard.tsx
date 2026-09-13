import Link from "next/link";
import type { DoctorListItemDTO } from "@/modules/doctor/doctor.types";
import { Button } from "@/components/shared/Button";
import { MapPinIcon } from "@/components/shared/icons";
import { cx } from "@/components/shared/cx";

function initials(fullName: string): string {
  return fullName
    .replace(/^(Dr\.?|Prof\.?)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Avatar({ doctor, className }: { doctor: DoctorListItemDTO; className: string }) {
  if (doctor.profileImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs, not part of next/image's configured domains
      <img src={doctor.profileImageUrl} alt="" className={cx(className, "object-cover")} loading="lazy" />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cx(className, "flex items-center justify-center bg-brand-50 font-semibold text-brand-700")}
    >
      {initials(doctor.fullName)}
    </div>
  );
}

export function DoctorCard({
  doctor,
  variant = "list",
}: {
  doctor: DoctorListItemDTO;
  variant?: "list" | "grid";
}) {
  if (variant === "grid") {
    return (
      <li className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <Avatar doctor={doctor} className="aspect-square w-full text-3xl" />
        <div className="flex flex-1 flex-col gap-1 p-4">
          <Link href={`/doctors/${doctor.slug}`} className="font-semibold text-ink hover:text-brand-700 hover:underline">
            {doctor.fullName}
          </Link>
          <Link href={`/specialties/${doctor.primarySpecialty.slug}`} className="text-sm font-medium text-brand-700 hover:underline">
            {doctor.primarySpecialty.name}
          </Link>
          {doctor.locationSummary && (
            <p className="flex items-center gap-1 text-sm text-muted">
              <MapPinIcon width={14} height={14} className="shrink-0" />
              <span className="truncate">{doctor.locationSummary}</span>
            </p>
          )}
          <Button href={`/doctors/${doctor.slug}`} variant="primary" size="sm" className="mt-3 w-full">
            View Profile
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      <div className="flex items-center gap-4 sm:flex-1">
        <Avatar doctor={doctor} className="h-20 w-20 shrink-0 rounded-xl text-lg" />

        <div className="min-w-0">
          <Link href={`/doctors/${doctor.slug}`} className="font-semibold text-ink hover:text-brand-700 hover:underline">
            {doctor.fullName}
          </Link>
          {doctor.degrees && <p className="text-sm text-muted">{doctor.degrees}</p>}
          <p className="mt-1 text-sm">
            <Link href={`/specialties/${doctor.primarySpecialty.slug}`} className="font-medium text-brand-700 hover:underline">
              {doctor.primarySpecialty.name}
            </Link>
          </p>
          {doctor.locationSummary && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <MapPinIcon width={14} height={14} className="shrink-0" />
              <span className="truncate">{doctor.locationSummary}</span>
            </p>
          )}
        </div>
      </div>

      <Button href={`/doctors/${doctor.slug}`} variant="outline" size="sm" className="w-full shrink-0 sm:w-auto">
        View Profile
      </Button>
    </li>
  );
}

import Link from "next/link";
import type { DoctorListItemDTO } from "@/modules/doctor/doctor.types";

export function DoctorCard({ doctor }: { doctor: DoctorListItemDTO }) {
  return (
    <li className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <Link href={`/doctors/${doctor.slug}`} className="font-semibold hover:underline">
        {doctor.fullName}
      </Link>
      {doctor.degrees && <p className="text-sm text-zinc-500">{doctor.degrees}</p>}
      <p className="text-sm">
        <Link href={`/specialties/${doctor.primarySpecialty.slug}`} className="hover:underline">
          {doctor.primarySpecialty.name}
        </Link>
      </p>
      {doctor.locationSummary && (
        <p className="text-sm text-zinc-500">{doctor.locationSummary}</p>
      )}
    </li>
  );
}

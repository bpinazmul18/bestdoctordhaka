"use client";

import { useActionState } from "react";
import { createDoctorAction } from "./actions";
import { Button } from "@/components/shared/Button";
import type { SpecialtyOptionDTO } from "@/modules/specialty/specialty.types";
import type { HospitalOptionDTO } from "@/modules/hospital/hospital.types";

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export function DoctorForm({
  specialties,
  hospitals,
}: {
  specialties: SpecialtyOptionDTO[];
  hospitals: HospitalOptionDTO[];
}) {
  const [state, action, pending] = useActionState(createDoctorAction, undefined);

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      {state?.message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      )}

      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-ink">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.fullName && <p className="mt-1 text-sm text-red-700">{state.errors.fullName[0]}</p>}
      </div>

      <div>
        <label htmlFor="degrees" className="mb-1 block text-sm font-medium text-ink">
          Degrees <span className="text-muted">(optional)</span>
        </label>
        <input
          id="degrees"
          name="degrees"
          placeholder="e.g. MBBS, FCPS"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
      </div>

      <div>
        <label htmlFor="designation" className="mb-1 block text-sm font-medium text-ink">
          Designation <span className="text-muted">(optional)</span>
        </label>
        <input
          id="designation"
          name="designation"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
      </div>

      <div>
        <label htmlFor="shortBio" className="mb-1 block text-sm font-medium text-ink">
          Short Bio <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="shortBio"
          name="shortBio"
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
      </div>

      <div>
        <label htmlFor="profileImageUrl" className="mb-1 block text-sm font-medium text-ink">
          Profile Image URL <span className="text-muted">(optional)</span>
        </label>
        <input
          id="profileImageUrl"
          name="profileImageUrl"
          type="url"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.profileImageUrl && (
          <p className="mt-1 text-sm text-red-700">{state.errors.profileImageUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="yearsOfExperience" className="mb-1 block text-sm font-medium text-ink">
          Years of Experience <span className="text-muted">(optional)</span>
        </label>
        <input
          id="yearsOfExperience"
          name="yearsOfExperience"
          type="number"
          min={0}
          max={80}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-medium text-ink">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue="DRAFT"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="primarySpecialtyId" className="mb-1 block text-sm font-medium text-ink">
          Primary Specialty
        </label>
        <select
          id="primarySpecialtyId"
          name="primarySpecialtyId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none"
        >
          <option value="" disabled>
            Select a specialty
          </option>
          {specialties.map((specialty) => (
            <option key={specialty.id} value={specialty.id}>
              {specialty.name}
            </option>
          ))}
        </select>
        {state?.errors?.primarySpecialtyId && (
          <p className="mt-1 text-sm text-red-700">{state.errors.primarySpecialtyId[0]}</p>
        )}
      </div>

      {specialties.length > 0 && (
        <fieldset>
          <legend className="mb-1 block text-sm font-medium text-ink">
            Additional Specialties <span className="text-muted">(optional)</span>
          </legend>
          <div className="flex flex-col gap-1.5 rounded-lg border border-slate-300 p-3">
            {specialties.map((specialty) => (
              <label key={specialty.id} className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" name="additionalSpecialtyIds" value={specialty.id} />
                {specialty.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {hospitals.length > 0 && (
        <fieldset>
          <legend className="mb-1 block text-sm font-medium text-ink">
            Hospital Affiliations <span className="text-muted">(optional)</span>
          </legend>
          <div className="flex flex-col gap-1.5 rounded-lg border border-slate-300 p-3">
            {hospitals.map((hospital) => (
              <label key={hospital.id} className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" name="hospitalIds" value={hospital.id} />
                {hospital.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-ink">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          placeholder="e.g. dr-jane-doe"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.slug && <p className="mt-1 text-sm text-red-700">{state.errors.slug[0]}</p>}
      </div>

      <Button type="submit" disabled={pending || specialties.length === 0} className="mt-2">
        {pending ? "Saving…" : "Add Doctor"}
      </Button>
      {specialties.length === 0 && (
        <p className="text-sm text-muted">Add a specialty first before adding a doctor.</p>
      )}
    </form>
  );
}

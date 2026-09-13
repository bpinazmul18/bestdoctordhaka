"use client";

import { useActionState, useId, useState } from "react";
import { createDoctorAction } from "./actions";
import { Button } from "@/components/shared/Button";
import { cx } from "@/components/shared/cx";
import type { SpecialtyOptionDTO } from "@/modules/specialty/specialty.types";
import type { HospitalOptionDTO } from "@/modules/hospital/hospital.types";
import type { LocationOptionDTO } from "@/modules/location/location.types";

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

const inputClasses =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-700">{message}</p>;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function CheckboxGroup({
  name,
  items,
}: {
  name: string;
  items: { id: string; label: string }[];
}) {
  return (
    <div className="grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto rounded-lg border border-slate-300 p-3 sm:grid-cols-2">
      {items.map((item) => (
        <label key={item.id} className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name={name}
            value={item.id}
            className="h-4 w-4 rounded border-slate-300 text-brand-700 focus-visible:outline-brand-600"
          />
          {item.label}
        </label>
      ))}
    </div>
  );
}

function ChamberRow({
  index,
  locations,
  hospitals,
  onRemove,
  removable,
}: {
  index: number;
  locations: LocationOptionDTO[];
  hospitals: HospitalOptionDTO[];
  onRemove: () => void;
  removable: boolean;
}) {
  const idPrefix = useId();

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Chamber {index + 1}</p>
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-red-700 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idPrefix}-name`} className="mb-1 block text-sm font-medium text-ink">
              Chamber / Hospital Name <span className="text-muted">(optional)</span>
            </label>
            <input
              id={`${idPrefix}-name`}
              name="chamberName"
              placeholder="e.g. Popular Diagnostic Center, Rangpur"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor={`${idPrefix}-location`} className="mb-1 block text-sm font-medium text-ink">
              Location
            </label>
            <select id={`${idPrefix}-location`} name="chamberLocationId" defaultValue="" className={cx(inputClasses, "bg-white")}>
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hospitals.length > 0 && (
          <div>
            <label htmlFor={`${idPrefix}-hospital`} className="mb-1 block text-sm font-medium text-ink">
              Hospital <span className="text-muted">(optional)</span>
            </label>
            <select id={`${idPrefix}-hospital`} name="chamberHospitalId" defaultValue="" className={cx(inputClasses, "bg-white")}>
              <option value="">None</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor={`${idPrefix}-address`} className="mb-1 block text-sm font-medium text-ink">
            Address
          </label>
          <input id={`${idPrefix}-address`} name="chamberAddressLine" placeholder="e.g. 77/1, Jail Road, Rangpur" className={inputClasses} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idPrefix}-phone`} className="mb-1 block text-sm font-medium text-ink">
              Phone <span className="text-muted">(optional)</span>
            </label>
            <input id={`${idPrefix}-phone`} name="chamberContactPhone" placeholder="+8809666787813" className={inputClasses} />
          </div>

          <div>
            <label htmlFor={`${idPrefix}-whatsapp`} className="mb-1 block text-sm font-medium text-ink">
              WhatsApp <span className="text-muted">(optional)</span>
            </label>
            <input id={`${idPrefix}-whatsapp`} name="chamberWhatsappNumber" placeholder="+8809666787813" className={inputClasses} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idPrefix}-hours`} className="mb-1 block text-sm font-medium text-ink">
              Visiting Hours <span className="text-muted">(optional)</span>
            </label>
            <input id={`${idPrefix}-hours`} name="chamberVisitingHours" placeholder="e.g. 5pm to 9pm" className={inputClasses} />
          </div>

          <div>
            <label htmlFor={`${idPrefix}-closed`} className="mb-1 block text-sm font-medium text-ink">
              Closed Day <span className="text-muted">(optional)</span>
            </label>
            <input id={`${idPrefix}-closed`} name="chamberClosedDay" placeholder="e.g. Friday" className={inputClasses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DoctorForm({
  specialties,
  hospitals,
  locations,
}: {
  specialties: SpecialtyOptionDTO[];
  hospitals: HospitalOptionDTO[];
  locations: LocationOptionDTO[];
}) {
  const [state, action, pending] = useActionState(createDoctorAction, undefined);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [chamberKeys, setChamberKeys] = useState<string[]>(() => [crypto.randomUUID()]);

  function addChamber() {
    setChamberKeys((keys) => [...keys, crypto.randomUUID()]);
  }

  function removeChamber(key: string) {
    setChamberKeys((keys) => keys.filter((k) => k !== key));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  return (
    <form action={action} className="mx-auto flex max-w-3xl flex-col gap-6">
      {state?.message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      )}

      <Section title="Basic Information">
        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-ink">
            Full Name
          </label>
          <input id="fullName" name="fullName" required className={inputClasses} />
          <FieldError message={state?.errors?.fullName?.[0]} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="degrees" className="mb-1 block text-sm font-medium text-ink">
              Degrees <span className="text-muted">(optional)</span>
            </label>
            <input id="degrees" name="degrees" placeholder="e.g. MBBS, FCPS" className={inputClasses} />
          </div>

          <div>
            <label htmlFor="designation" className="mb-1 block text-sm font-medium text-ink">
              Designation <span className="text-muted">(optional)</span>
            </label>
            <input id="designation" name="designation" className={inputClasses} />
          </div>
        </div>

        <div>
          <label htmlFor="shortBio" className="mb-1 block text-sm font-medium text-ink">
            Short Bio <span className="text-muted">(optional)</span>
          </label>
          <textarea id="shortBio" name="shortBio" rows={3} className={inputClasses} />
        </div>
      </Section>

      <Section title="Profile Photo" description="JPEG, PNG, or WebP — max 5MB.">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100">
            {photoPreview && (
              // eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not an optimizable remote asset
              <img src={photoPreview} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="w-full flex-1">
            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className={cx(
                inputClasses,
                "file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100",
              )}
            />
            <FieldError message={state?.errors?.profileImage?.[0]} />
          </div>
        </div>
      </Section>

      <Section title="Professional Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium text-ink">
              Status
            </label>
            <select id="status" name="status" defaultValue="DRAFT" className={cx(inputClasses, "bg-white")}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
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
            className={cx(inputClasses, "bg-white")}
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
          <FieldError message={state?.errors?.primarySpecialtyId?.[0]} />
        </div>

        {specialties.length > 0 && (
          <div>
            <p className="mb-1 block text-sm font-medium text-ink">
              Additional Specialties <span className="text-muted">(optional)</span>
            </p>
            <CheckboxGroup
              name="additionalSpecialtyIds"
              items={specialties.map((s) => ({ id: s.id, label: s.name }))}
            />
          </div>
        )}
      </Section>

      {hospitals.length > 0 && (
        <Section title="Hospital Affiliations" description="Optional.">
          <CheckboxGroup name="hospitalIds" items={hospitals.map((h) => ({ id: h.id, label: h.name }))} />
        </Section>
      )}

      <Section
        title="Chambers (Clinic / Visiting Information)"
        description="Optional. Add one or more chambers where this doctor sees patients."
      >
        {chamberKeys.map((key, index) => (
          <ChamberRow
            key={key}
            index={index}
            locations={locations}
            hospitals={hospitals}
            onRemove={() => removeChamber(key)}
            removable={chamberKeys.length > 1}
          />
        ))}

        <Button type="button" variant="outline" size="sm" onClick={addChamber} className="self-start">
          + Add Another Chamber
        </Button>
      </Section>

      <Section
        title="Conditions Treated"
        description="Optional. One condition per line — only what this doctor is actually known to treat."
      >
        <div>
          <label htmlFor="conditionsTreated" className="mb-1 block text-sm font-medium text-ink">
            Conditions
          </label>
          <textarea
            id="conditionsTreated"
            name="conditionsTreated"
            rows={5}
            placeholder={"Stroke, Paralysis & Post-stroke Rehabilitation\nMigraine & Chronic Headache\nEpilepsy & Seizure Disorders"}
            className={inputClasses}
          />
          <FieldError message={state?.errors?.conditionsTreated?.[0]} />
        </div>
      </Section>

      <Section title="URL Slug" description="Used in the doctor's public profile URL.">
        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium text-ink">
            Slug
          </label>
          <input id="slug" name="slug" required placeholder="e.g. dr-jane-doe" className={inputClasses} />
          <FieldError message={state?.errors?.slug?.[0]} />
        </div>
      </Section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending || specialties.length === 0}>
          {pending ? "Saving…" : "Add Doctor"}
        </Button>
        {specialties.length === 0 && (
          <p className="text-sm text-muted">Add a specialty first before adding a doctor.</p>
        )}
      </div>
    </form>
  );
}

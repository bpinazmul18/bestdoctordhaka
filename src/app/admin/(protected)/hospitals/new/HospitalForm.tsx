"use client";

import { useActionState } from "react";
import { createHospitalAction } from "./actions";
import { Button } from "@/components/shared/Button";
import type { LocationOptionDTO } from "@/modules/location/location.types";

export function HospitalForm({ locations }: { locations: LocationOptionDTO[] }) {
  const [state, action, pending] = useActionState(createHospitalAction, undefined);

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      {state?.message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.name && <p className="mt-1 text-sm text-red-700">{state.errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="locationId" className="mb-1 block text-sm font-medium text-ink">
          Location
        </label>
        <select
          id="locationId"
          name="locationId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none"
        >
          <option value="" disabled>
            Select a location
          </option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}, {location.city}
            </option>
          ))}
        </select>
        {state?.errors?.locationId && (
          <p className="mt-1 text-sm text-red-700">{state.errors.locationId[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-ink">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          placeholder="e.g. square-hospital"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.slug && <p className="mt-1 text-sm text-red-700">{state.errors.slug[0]}</p>}
      </div>

      <Button type="submit" disabled={pending || locations.length === 0} className="mt-2">
        {pending ? "Saving…" : "Add Hospital"}
      </Button>
      {locations.length === 0 && (
        <p className="text-sm text-muted">Add a location first before adding a hospital.</p>
      )}
    </form>
  );
}

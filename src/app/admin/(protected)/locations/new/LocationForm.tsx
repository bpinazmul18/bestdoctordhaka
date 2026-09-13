"use client";

import { useActionState } from "react";
import { createLocationAction } from "./actions";
import { Button } from "@/components/shared/Button";

export function LocationForm() {
  const [state, action, pending] = useActionState(createLocationAction, undefined);

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
        <label htmlFor="city" className="mb-1 block text-sm font-medium text-ink">
          City
        </label>
        <input
          id="city"
          name="city"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.city && <p className="mt-1 text-sm text-red-700">{state.errors.city[0]}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-ink">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          placeholder="e.g. dhanmondi"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.slug && <p className="mt-1 text-sm text-red-700">{state.errors.slug[0]}</p>}
      </div>

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Saving…" : "Add Location"}
      </Button>
    </form>
  );
}

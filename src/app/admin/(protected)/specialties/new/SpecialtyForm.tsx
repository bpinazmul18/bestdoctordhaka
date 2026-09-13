"use client";

import { useActionState } from "react";
import { createSpecialtyAction } from "./actions";
import { Button } from "@/components/shared/Button";

export function SpecialtyForm() {
  const [state, action, pending] = useActionState(createSpecialtyAction, undefined);

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
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-ink">
          Description <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.description && (
          <p className="mt-1 text-sm text-red-700">{state.errors.description[0]}</p>
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
          placeholder="e.g. cardiology"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.slug && <p className="mt-1 text-sm text-red-700">{state.errors.slug[0]}</p>}
      </div>

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Saving…" : "Add Specialty"}
      </Button>
    </form>
  );
}

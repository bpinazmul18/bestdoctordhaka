"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/shared/Button";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.email && <p className="mt-1 text-sm text-red-700">{state.errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none"
        />
        {state?.errors?.password && <p className="mt-1 text-sm text-red-700">{state.errors.password[0]}</p>}
      </div>

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}

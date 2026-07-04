"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "./actions";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-text-primary">
              Zonely
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-forex" />
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Log in to your market dashboard
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-lg border border-border bg-surface p-6"
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs text-text-secondary">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-text-primary outline-none focus:border-forex"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs text-text-secondary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-text-primary outline-none focus:border-forex"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="rounded-md bg-down-soft px-3 py-2 text-xs text-down">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-forex py-2 font-display text-sm font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-text-secondary">
          New here?{" "}
          <Link href="/signup" className="text-forex hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

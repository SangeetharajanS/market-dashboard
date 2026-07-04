"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type SignupState } from "./actions";

const initialState: SignupState = { error: null, success: false };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base px-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-up-soft text-up">
            ✓
          </div>
          <h1 className="font-display text-lg font-semibold text-text-primary">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            We sent a confirmation link to your email. Click it to activate your
            account, then log in.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block text-sm text-forex hover:underline"
          >
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-text-primary">
              Pulse
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-india" />
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Create your account — pick your own password
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
              className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-text-primary outline-none focus:border-india"
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
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-text-primary outline-none focus:border-india"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs text-text-secondary"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-md border border-border bg-base px-3 py-2 text-sm text-text-primary outline-none focus:border-india"
              placeholder="Re-enter your password"
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
            className="w-full rounded-md bg-india py-2 font-display text-sm font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-india hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

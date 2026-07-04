import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base px-4 text-center">
      <div className="inline-flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold text-text-primary">
          Pulse
        </span>
        <span className="h-2 w-2 rounded-full bg-forex" />
      </div>
      <p className="mt-4 max-w-md text-text-secondary">
        FII/DII flows, index &amp; forex levels, options OI, and high-impact
        news — one screen, updated daily.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-india px-5 py-2.5 font-display text-sm font-semibold text-base transition-opacity hover:opacity-90"
        >
          Create account
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-border px-5 py-2.5 font-display text-sm font-semibold text-text-primary transition-colors hover:border-forex"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}

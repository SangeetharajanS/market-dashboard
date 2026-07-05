import Link from "next/link";
import AuthBackground from "@/components/AuthBackground";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <AuthBackground />

      <div className="relative z-10">
        <div className="inline-flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold text-text-primary">
            Zonely
          </span>
          <span className="h-2 w-2 rounded-full bg-forex" />
        </div>
        <p className="mt-4 max-w-md text-text-secondary">
          FII/DII flows, index &amp; forex levels, options OI, and high-impact
          news — one screen, updated daily.
        </p>

        <div className="mt-8 flex justify-center gap-3">
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
      </div>
    </main>
  );
}

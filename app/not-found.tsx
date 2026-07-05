import Link from "next/link";
import AuthBackground from "@/components/AuthBackground";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <AuthBackground />
      <div className="relative z-10">
        <div className="inline-flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold text-text-primary">
            404
          </span>
          <span className="h-2 w-2 rounded-full bg-warn" />
        </div>
        <p className="mt-3 text-text-secondary">
          This page doesn&apos;t exist — maybe it moved, or the link was off.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-md bg-forex px-5 py-2.5 font-display text-sm font-semibold text-base transition-opacity hover:opacity-90"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}

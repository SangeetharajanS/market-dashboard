import Skeleton from "@/components/Skeleton";

export default function OverviewLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-5">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="mt-3 h-4 w-24" />
            <Skeleton className="mt-1.5 h-3 w-36" />
          </div>
        ))}
      </div>
      <div className="max-w-xl rounded-lg border border-border bg-surface p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-4 h-24 w-full" />
      </div>
    </div>
  );
}

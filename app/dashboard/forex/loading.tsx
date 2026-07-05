import Skeleton from "@/components/Skeleton";

export default function ForexLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-3 w-24" />
            <Skeleton className="mt-4 h-7 w-28" />
            <Skeleton className="mt-4 h-16 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

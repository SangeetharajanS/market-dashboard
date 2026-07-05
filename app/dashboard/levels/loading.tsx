import Skeleton from "@/components/Skeleton";

export default function LevelsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="rounded-lg border border-border bg-surface p-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-8 w-full" />
        ))}
      </div>
    </div>
  );
}

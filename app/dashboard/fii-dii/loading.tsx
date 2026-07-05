import Skeleton from "@/components/Skeleton";

export default function FiiDiiLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="max-w-xl rounded-lg border border-border bg-surface p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-4 h-32 w-full" />
      </div>
    </div>
  );
}

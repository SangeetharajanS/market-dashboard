export default function LiveLegend() {
  return (
    <div className="flex items-center gap-3 text-xs text-text-muted">
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-up" /> live
      </span>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-warn" /> sample
      </span>
    </div>
  );
}

import FiiDiiCard from "@/components/FiiDiiCard";

export default function FiiDiiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-lg font-semibold text-text-primary">
          FII / DII Activity
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Daily provisional cash-market flows from foreign and domestic
          institutional investors.
        </p>
      </div>
      <div className="max-w-xl">
        <FiiDiiCard />
      </div>
    </div>
  );
}

import NewsList from "@/components/NewsList";
import { getLiveNews } from "@/lib/data/news";

export default async function NewsPage() {
  const { india, forex } = await getLiveNews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-lg font-semibold text-text-primary">
          News
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Kept in separate columns by market so nothing gets mixed up.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NewsList tag="india" items={india.items} live={india.live} />
        <NewsList tag="forex" items={forex.items} live={forex.live} />
      </div>
    </div>
  );
}

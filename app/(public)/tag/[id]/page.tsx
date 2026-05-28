import { getArticles, getAllTags } from '@/lib/queries';
import ArticleCard from '@/components/article/ArticleCard';
import Pagination from '@/components/article/Pagination';

export const dynamic = 'force-dynamic';

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ items, totalPages, total }, tags] = await Promise.all([
    getArticles({ tag: id, page }),
    getAllTags(),
  ]);
  const name = tags.find((t) => t.id === id)?.name ?? '标签';

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">
        标签：#{name} <span className="text-base font-normal text-gray-400">({total})</span>
      </h1>
      <div className="space-y-5">
        {items.length === 0 ? (
          <p className="text-gray-500">该标签下暂无文章。</p>
        ) : (
          items.map((a) => <ArticleCard key={a.id} article={a} />)
        )}
        <Pagination page={page} totalPages={totalPages} basePath={`/tag/${id}`} />
      </div>
    </div>
  );
}

import { getArticles, getAllCategories } from '@/lib/queries';
import ArticleCard from '@/components/article/ArticleCard';
import Pagination from '@/components/article/Pagination';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ items, totalPages, total }, categories] = await Promise.all([
    getArticles({ classId: id, page }),
    getAllCategories(),
  ]);
  const name = categories.find((c) => c.id === id)?.name ?? '分类';

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">
        分类：{name} <span className="text-base font-normal text-gray-400">({total})</span>
      </h1>
      <div className="space-y-5">
        {items.length === 0 ? (
          <p className="text-gray-500">该分类下暂无文章。</p>
        ) : (
          items.map((a) => <ArticleCard key={a.id} article={a} />)
        )}
        <Pagination page={page} totalPages={totalPages} basePath={`/category/${id}`} />
      </div>
    </div>
  );
}

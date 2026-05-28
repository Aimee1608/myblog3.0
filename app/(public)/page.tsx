import { getArticles } from '@/lib/queries';
import ArticleCard from '@/components/article/ArticleCard';
import Pagination from '@/components/article/Pagination';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { items, totalPages } = await getArticles({ page, pageSize: 10 });

  return (
    <div>
      {items.length === 0 ? (
        <p className="text-gray-500">暂无文章。</p>
      ) : (
        items.map((a) => <ArticleCard key={a.id} article={a} />)
      )}
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

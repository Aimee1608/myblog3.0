import ArticleForm from '@/components/admin/ArticleForm';
import { getAllCategories, getAllTags } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([getAllCategories(), getAllTags()]);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">新建文章</h1>
      <ArticleForm article={null} categories={categories} tags={tags} />
    </div>
  );
}

import { notFound } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';
import { getArticleForEdit, getAllCategories, getAllTags } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories, tags] = await Promise.all([
    getArticleForEdit(id),
    getAllCategories(),
    getAllTags(),
  ]);
  if (!article) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">编辑文章</h1>
      <ArticleForm article={article} categories={categories} tags={tags} />
    </div>
  );
}

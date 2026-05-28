import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dayjs from 'dayjs';
import { getArticleById, getLikeInfo } from '@/lib/queries';
import { auth } from '@/auth';
import MarkdownContent from '@/components/article/MarkdownContent';
import CommentList from '@/components/article/CommentList';
import LikeButton from '@/components/article/LikeButton';
import BrowseLogger from '@/components/article/BrowseLogger';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return { title: '文章未找到' };
  return { title: article.title, description: article.summary };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const session = await auth();
  const likeInfo = await getLikeInfo(article.id, session?.user?.userId);

  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="mb-3 text-3xl font-bold leading-tight">{article.title}</h1>
      <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-gray-200 pb-4 text-sm text-gray-500 dark:border-gray-800">
        <time>{dayjs(article.createDate).format('YYYY 年 MM 月 DD 日')}</time>
        {article.categoryName && <span>· {article.categoryName}</span>}
        {article.tagNames.map((t) => (
          <span key={t} className="text-blue-600 dark:text-blue-400">
            #{t}
          </span>
        ))}
      </div>
      <MarkdownContent content={article.content} />
      <BrowseLogger articleId={article.id} />
      <div className="mt-10 flex justify-center">
        <LikeButton articleId={article.id} count={likeInfo.count} liked={likeInfo.liked} />
      </div>
      <CommentList articleId={article.id} />
    </article>
  );
}

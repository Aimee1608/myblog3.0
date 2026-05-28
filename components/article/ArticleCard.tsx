import Link from 'next/link';
import dayjs from 'dayjs';
import type { ArticleListItem } from '@/lib/queries';

export default function ArticleCard({ article }: { article: ArticleListItem }) {
  const d = dayjs(article.createDate);
  return (
    <article className="card-box mb-10">
      {/* 左上圆形日期角标 */}
      <span className="round-date">
        <span className="month block">{d.format('M')} 月</span>
        <span className="day block">{d.format('DD')}</span>
      </span>

      <header>
        <div className="px-2 pb-1 pt-5 text-center text-2xl font-bold leading-8">
          <Link href={`/article/${article.id}`} className="transition-colors hover:text-brand-purple">
            {article.title}
          </Link>
        </div>
        <div className="my-2 text-center text-sm text-[#555]">
          发表于 <time>{d.format('YYYY-MM-DD')}</time>
          {` · ${article.browseCount} 次围观`}
          {` · 活捉 ${article.commentCount} 条`}
          {` · ${article.likeCount} 点赞`}
          {` · ${article.collectCount} 收藏`}
        </div>
        {/* 分类标签：元信息下方，左突出带三角（2.0 样式） */}
        {article.categoryName && (
          <Link href={`/category/${article.classId}`} className="ui-label">
            {article.categoryName}
          </Link>
        )}
      </header>

      {article.summary && (
        <p className="mt-1 line-clamp-3 px-2 text-sm leading-6 text-gray-600">{article.summary}</p>
      )}

      <div className="mt-4 text-center">
        <Link
          href={`/article/${article.id}`}
          className="inline-block rounded bg-brand-blue px-5 py-1.5 text-xs text-white transition-colors hover:bg-brand-purple-dark"
        >
          阅读全文 »
        </Link>
      </div>
    </article>
  );
}

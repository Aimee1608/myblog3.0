import Link from 'next/link';
import dayjs from 'dayjs';
import { getAdminArticles } from '@/lib/queries';
import { deleteArticle, toggleArticleState } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理（{articles.length}）</h1>
        <Link
          href="/admin/articles/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + 新建文章
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-800">
          <tr>
            <th className="py-2">标题</th>
            <th className="py-2">分类</th>
            <th className="py-2">状态</th>
            <th className="py-2">日期</th>
            <th className="py-2 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2 pr-4">
                <Link href={`/admin/articles/${a.id}/edit`} className="hover:text-blue-600">
                  {a.title}
                </Link>
              </td>
              <td className="py-2 pr-4 text-gray-500">{a.categoryName || '—'}</td>
              <td className="py-2 pr-4">
                {a.state === 1 ? (
                  <span className="text-green-600">已发布</span>
                ) : (
                  <span className="text-gray-400">隐藏</span>
                )}
              </td>
              <td className="py-2 pr-4 text-gray-500">{dayjs(a.createDate).format('YYYY-MM-DD')}</td>
              <td className="py-2 text-right">
                <div className="flex justify-end gap-2">
                  <form
                    action={async () => {
                      'use server';
                      await toggleArticleState(a.id, a.state === 1 ? 0 : 1);
                    }}
                  >
                    <button className="text-xs text-gray-500 hover:text-gray-900">
                      {a.state === 1 ? '隐藏' : '发布'}
                    </button>
                  </form>
                  <form
                    action={async () => {
                      'use server';
                      await deleteArticle(a.id);
                    }}
                  >
                    <button className="text-xs text-red-500 hover:text-red-700">删除</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

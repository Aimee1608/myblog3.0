import dayjs from 'dayjs';
import { getAdminComments } from '@/lib/queries';
import { deleteComment, setCommentState } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminCommentsPage() {
  const comments = await getAdminComments();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">评论管理（最近 {comments.length} 条）</h1>
      <ul className="space-y-3">
        {comments.map((c) => (
          <li
            key={c.id}
            className="flex items-start justify-between gap-4 rounded border border-gray-200 p-3 text-sm dark:border-gray-800"
          >
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                <span className="font-medium text-gray-600 dark:text-gray-300">{c.username}</span>
                <time>{dayjs(c.createDate).format('YYYY-MM-DD HH:mm')}</time>
                {c.state !== 1 && <span className="text-orange-500">已隐藏</span>}
              </div>
              <p className="whitespace-pre-wrap break-words">{c.content}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <form
                action={async () => {
                  'use server';
                  await setCommentState(c.id, c.state === 1 ? 0 : 1);
                }}
              >
                <button className="text-xs text-gray-500 hover:text-gray-900">
                  {c.state === 1 ? '隐藏' : '显示'}
                </button>
              </form>
              <form
                action={async () => {
                  'use server';
                  await deleteComment(c.id);
                }}
              >
                <button className="text-xs text-red-500 hover:text-red-700">删除</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

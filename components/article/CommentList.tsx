import dayjs from 'dayjs';
import { getComments } from '@/lib/queries';
import { renderComment } from '@/lib/emoji';
import { auth } from '@/auth';
import CommentForm from './CommentForm';

// Comment display + (when logged in) a submit form.
export default async function CommentList({
  articleId,
  title = '评论',
}: {
  articleId: string;
  title?: string;
}) {
  const [comments, session] = await Promise.all([getComments(articleId), auth()]);

  return (
    <section>
      <h2 className="mb-5 text-xl font-semibold">
        {title}（{comments.length}）
      </h2>

      {session?.user ? (
        <CommentForm articleId={articleId} />
      ) : (
        <p className="mb-6 text-sm text-gray-500">登录后参与评论。</p>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">还没有评论，来抢沙发吧。</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              {c.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.avatar}
                  alt={c.username}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-500 dark:bg-gray-700">
                  {c.username.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 text-sm">
                  <span className="font-medium">{c.username}</span>
                  <time className="text-xs text-gray-400">
                    {dayjs(c.createDate).format('YYYY-MM-DD HH:mm')}
                  </time>
                  {c.parentId && <span className="text-xs text-gray-400">回复</span>}
                </div>
                <p
                  className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700 dark:text-gray-300 [&_img]:inline [&_img]:h-5 [&_img]:w-5 [&_img]:align-text-bottom"
                  dangerouslySetInnerHTML={{ __html: renderComment(c.content) }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

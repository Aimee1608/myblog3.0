'use client';

import { toggleLike } from '@/app/(public)/article/actions';

export default function LikeButton({
  articleId,
  count,
  liked,
}: {
  articleId: string;
  count: number;
  liked: boolean;
}) {
  return (
    <form action={toggleLike.bind(null, articleId)}>
      <button
        type="submit"
        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition ${
          liked
            ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950'
            : 'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500 dark:border-gray-700'
        }`}
      >
        <span>{liked ? '♥' : '♡'}</span>
        <span>{count}</span>
      </button>
    </form>
  );
}

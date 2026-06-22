'use client';

import { useRef, useState } from 'react';
import { postComment } from '@/app/(public)/article/actions';
import { OwOlist } from '@/lib/emoji';

export default function CommentForm({ articleId }: { articleId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const insertEmoji = (title: string) => {
    const ta = taRef.current;
    if (!ta) return;
    ta.value = ta.value + `[${title}]`;
    ta.focus();
  };

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await postComment(articleId, formData);
        formRef.current?.reset();
        setShowEmoji(false);
      }}
      className="mb-6"
    >
      <textarea
        ref={taRef}
        name="content"
        required
        rows={3}
        placeholder="说点什么呢~"
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
      />
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          😀 表情
        </button>
        <button
          type="submit"
          className="rounded bg-brand-blue px-4 py-1.5 text-sm text-white hover:bg-brand-purple-dark"
        >
          发表评论
        </button>
      </div>

      {showEmoji && (
        <div className="mt-2 grid max-h-56 grid-cols-8 gap-1 overflow-y-auto rounded border border-gray-200 p-2 sm:grid-cols-10">
          {OwOlist.map((e) => (
            <button
              type="button"
              key={e.title}
              onClick={() => insertEmoji(e.title)}
              title={e.title}
              className="rounded p-1 transition-transform hover:scale-125 hover:bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/img/emot/fluent3d/${e.url}`} alt={e.title} className="h-7 w-7" />
            </button>
          ))}
        </div>
      )}
    </form>
  );
}

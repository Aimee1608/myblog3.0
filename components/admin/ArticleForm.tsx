'use client';

import { useState } from 'react';
import type { ArticleEditData, Category, Tag } from '@/lib/queries';
import { saveArticle } from '@/app/admin/articles/actions';

export default function ArticleForm({
  article,
  categories,
  tags,
}: {
  article: ArticleEditData | null;
  categories: Category[];
  tags: Tag[];
}) {
  const [content, setContent] = useState(article?.content ?? '');
  const action = saveArticle.bind(null, article?.id ?? null);

  const inputCls =
    'w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900';

  return (
    <form action={action} className="max-w-3xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">标题</label>
        <input name="title" defaultValue={article?.title ?? ''} required className={inputCls} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">分类</label>
          <select name="classId" defaultValue={article?.classId ?? ''} className={inputCls}>
            <option value="">未分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">状态</label>
          <select name="state" defaultValue={String(article?.state ?? 1)} className={inputCls}>
            <option value="1">发布</option>
            <option value="0">隐藏</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">标签</label>
        <div className="flex flex-wrap gap-3">
          {tags.map((t) => (
            <label key={t.id} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                name="tags"
                value={t.id}
                defaultChecked={article?.tags.includes(t.id)}
              />
              {t.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-1">
          <input type="checkbox" name="isHot" value="1" defaultChecked={article?.isHot === 1} /> 热门
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            name="isRecommend"
            value="1"
            defaultChecked={article?.isRecommend === 1}
          />{' '}
          推荐
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">正文（Markdown）</label>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className={`${inputCls} font-mono`}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          保存
        </button>
        <a href="/admin/articles" className="rounded border px-4 py-2 text-sm">
          取消
        </a>
      </div>
    </form>
  );
}

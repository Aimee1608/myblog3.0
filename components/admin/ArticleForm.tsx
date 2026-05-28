'use client';

import { useRef, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
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
  const [uploading, setUploading] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const action = saveArticle.bind(null, article?.id ?? null);

  const inputCls =
    'w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900';

  // Insert text at the textarea's current cursor, keeping selection sane.
  const insertAtCursor = useCallback((text: string) => {
    const ta = taRef.current;
    if (!ta) {
      setContent((c) => c + text);
      return;
    }
    const start = ta.selectionStart ?? content.length;
    const end = ta.selectionEnd ?? content.length;
    const next = content.slice(0, start) + text + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + text.length;
      ta.selectionStart = ta.selectionEnd = pos;
    });
  }, [content]);

  const uploadFile = useCallback(async (file: File) => {
    const placeholder = `![上传中…(${file.name})]()`;
    insertAtCursor(placeholder + '\n');
    setUploading((n) => n + 1);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? `HTTP ${res.status}`);
      setContent((c) => c.replace(placeholder, `![](${data.url})`));
      setErrMsg('');
    } catch (e) {
      setContent((c) => c.replace(placeholder, `<!-- 上传失败: ${(e as Error).message} -->`));
      setErrMsg(`上传失败: ${(e as Error).message}`);
    } finally {
      setUploading((n) => n - 1);
    }
  }, [insertAtCursor]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    for (const f of Array.from(files)) {
      if (f.type.startsWith('image/')) uploadFile(f);
    }
  }, [uploadFile]);

  return (
    <form action={action} className="max-w-6xl space-y-5">
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
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium">正文（Markdown）</label>
          <span className="text-xs text-gray-500">
            支持粘贴 / 拖入图片自动上传
            {uploading > 0 && (
              <span className="ml-2 text-blue-500">· 上传中 {uploading}…</span>
            )}
            {errMsg && <span className="ml-2 text-red-500">· {errMsg}</span>}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <textarea
            ref={taRef}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={(e) => {
              const items = e.clipboardData?.items;
              if (!items) return;
              const files: File[] = [];
              for (const it of Array.from(items)) {
                if (it.type.startsWith('image/')) {
                  const f = it.getAsFile();
                  if (f) files.push(f);
                }
              }
              if (files.length > 0) {
                e.preventDefault();
                handleFiles(files);
              }
            }}
            onDrop={(e) => {
              if (e.dataTransfer?.files?.length) {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            rows={24}
            className={`${inputCls} font-mono`}
          />
          <div className="prose prose-slate max-w-none overflow-auto rounded border border-gray-300 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-900 [&_img]:max-w-full">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
              {content || '_预览将显示在这里…_'}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={uploading > 0}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading > 0 ? '等待上传完成…' : '保存'}
        </button>
        <a href="/admin/articles" className="rounded border px-4 py-2 text-sm">
          取消
        </a>
      </div>
    </form>
  );
}

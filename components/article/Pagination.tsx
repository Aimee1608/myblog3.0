import Link from 'next/link';

export default function Pagination({
  page,
  totalPages,
  basePath = '/',
}: {
  page: number;
  totalPages: number;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const href = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav className="mt-8 flex items-center justify-between text-sm">
      {prev ? (
        <Link href={href(prev)} className="rounded border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800">
          ← 上一页
        </Link>
      ) : (
        <span className="rounded border px-3 py-1.5 text-gray-300">← 上一页</span>
      )}
      <span className="text-gray-500">
        {page} / {totalPages}
      </span>
      {next ? (
        <Link href={href(next)} className="rounded border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800">
          下一页 →
        </Link>
      ) : (
        <span className="rounded border px-3 py-1.5 text-gray-300">下一页 →</span>
      )}
    </nav>
  );
}

import Link from 'next/link';
import dayjs from 'dayjs';
import { getArchives } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: '归档' };

export default async function ArchivePage() {
  const groups = await getArchives();
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">归档 · 共 {total} 篇</h1>
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.ym}>
            <h2 className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">{g.ym}</h2>
            <ul className="space-y-2 border-l border-gray-200 pl-4 dark:border-gray-800">
              {g.items.map((it) => (
                <li key={it.id} className="flex items-baseline gap-3 text-sm">
                  <time className="shrink-0 text-gray-400">{dayjs(it.createDate).format('MM-DD')}</time>
                  <Link href={`/article/${it.id}`} className="hover:text-blue-600">
                    {it.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

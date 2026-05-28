import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const ADMIN_NAV = [
  { href: '/admin', label: '概览' },
  { href: '/admin/articles', label: '文章管理' },
  { href: '/admin/comments', label: '评论管理' },
  { href: '/admin/taxonomy', label: '分类 / 标签' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect('/');

  return (
    <div className="flex min-h-screen">
      <aside className="w-48 shrink-0 border-r border-gray-200 p-4 dark:border-gray-800">
        <Link href="/" className="mb-6 block text-sm text-gray-400 hover:text-gray-600">
          ← 返回前台
        </Link>
        <nav className="space-y-1 text-sm">
          {ADMIN_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

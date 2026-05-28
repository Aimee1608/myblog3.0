import Link from 'next/link';
import { auth, signIn, signOut } from '@/auth';

const NAV = [
  { href: '/', label: '首页' },
  { href: '/archive', label: '归档' },
  { href: '/message', label: '留言板' },
  { href: '/links', label: '友链' },
  { href: '/about', label: '关于' },
];

export default async function Header() {
  const session = await auth();
  const item = 'rounded px-3 py-1 transition-colors hover:bg-[#48456d]';

  return (
    <header
      className="fixed top-0 z-50 w-full shadow-md"
      style={{ background: 'rgba(40,42,44,0.6)' }}
    >
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between px-4 text-sm text-white">
        <Link href="/" className="font-display text-lg tracking-wide">
          Aimee
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={item}>
              {n.label}
            </Link>
          ))}
          {session?.user?.isAdmin && (
            <Link href="/admin" className={item}>
              后台
            </Link>
          )}
          {session?.user ? (
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button type="submit" className={item}>
                登出
              </button>
            </form>
          ) : (
            <form
              action={async () => {
                'use server';
                await signIn('github');
              }}
            >
              <button type="submit" className={item}>
                登录
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}

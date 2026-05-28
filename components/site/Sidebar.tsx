import Link from 'next/link';
import { getSidebarData } from '@/lib/queries';
import SiteLove from './SiteLove';

export default async function Sidebar() {
  const { loveCount, recentComments, hotArticles } = await getSidebarData();

  return (
    <aside className="space-y-5">
      {/* 博主信息卡 */}
      <section className="card-box overflow-hidden !p-0">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/headtou02.jpg" alt="Aimee" className="min-h-[100px] w-full object-cover" />
          <h1
            className="absolute bottom-1 left-1/2 w-[130px] -translate-x-1/2 text-center text-xl font-bold text-white"
            style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.7)' }}
          >
            <span className="opacity-30">女王</span>Aimee
          </h1>
        </div>
        <div className="p-4 text-center">
          <p className="text-sm font-bold">你能抓到我么？</p>
          <div className="mt-2 flex justify-center gap-2">
            <a href="https://github.com/Aimee1608" target="_blank" rel="noopener noreferrer" className="catch-icon" title="GitHub">
              GH
            </a>
            <a href="https://weibo.com/u/2242812941" target="_blank" rel="noopener noreferrer" className="catch-icon" title="微博">
              微
            </a>
            <Link href="/about" className="catch-icon" title="更多">
              ···
            </Link>
          </div>
        </div>
      </section>

      {/* Do you like me 点赞心形 */}
      <SiteLove count={loveCount} />

      {/* 最新评论 */}
      <section className="card-box">
        <h2 className="ui-label">这些人都排着队来跟我说话</h2>
        <ul className="mt-3">
          {recentComments.map((c, i) => (
            <li key={i} className="border-b border-gray-200 py-2 last:border-0">
              <div className="flex gap-2">
                {c.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.avatar} alt={c.username} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
                    {c.username.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold">
                    {c.username} 在「{c.title}」中说:
                  </p>
                  <p className="line-clamp-2 text-xs text-gray-500">{c.content}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 热门浏览 */}
      <section className="card-box">
        <h2 className="ui-label">大家都排队来看这些</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {hotArticles.map((h) => (
            <li key={h.id}>
              <Link href={`/article/${h.id}`} className="font-semibold hover:text-brand-purple">
                {h.title}
              </Link>{' '}
              —— {h.count} 次围观
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

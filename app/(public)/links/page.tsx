import { getFriendLinks } from '@/lib/queries';
import CommentList from '@/components/article/CommentList';

export const dynamic = 'force-dynamic';
export const metadata = { title: '友链' };

export default async function LinksPage() {
  const links = await getFriendLinks();

  return (
    <div className="space-y-6">
      <div className="card-box">
        <h1 className="mb-4 text-2xl font-bold">友情链接</h1>
        {links.length === 0 ? (
          <p className="text-gray-500">暂无友链。</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:shadow-md"
              >
                {l.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.icon} alt={l.name} className="h-10 w-10 rounded-full object-cover" />
                )}
                <div className="min-w-0">
                  <div className="truncate font-medium">{l.name}</div>
                  {l.desc && <div className="truncate text-xs text-gray-500">{l.desc}</div>}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="card-box">
        <CommentList articleId="friendslink" title="留言" />
      </div>
    </div>
  );
}

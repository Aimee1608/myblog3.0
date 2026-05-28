import CommentList from '@/components/article/CommentList';

export const dynamic = 'force-dynamic';
export const metadata = { title: '关于' };

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="card-box">
        <article className="prose prose-slate max-w-none">
          <h1>关于我</h1>
          <p>你好，我是 Aimee。这里是我的个人博客，记录前端、全栈开发与日常思考。</p>
          <p>本站基于 Next.js 重构（3.0 版本），数据延续自 2.0 时代的积累。</p>

          <h2>订阅</h2>
          <p>
            喜欢这里的内容？欢迎通过{' '}
            <a href="/rss.xml" className="text-brand-purple hover:underline">
              RSS
            </a>{' '}
            订阅，新文章会自动出现在你的阅读器（推荐 Inoreader / Feedly / NetNewsWire / FreshRSS）。
            订阅地址：<code>https://mangoya.cn/rss.xml</code>
          </p>

          <h2>联系</h2>
          <p>
            GitHub：
            <a
              href="https://github.com/Aimee1608"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-purple hover:underline"
            >
              @Aimee1608
            </a>
          </p>
        </article>
      </div>
      <div className="card-box">
        <CommentList articleId="aboutme" title="留言" />
      </div>
    </div>
  );
}

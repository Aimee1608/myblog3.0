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
        </article>
      </div>
      <div className="card-box">
        <CommentList articleId="aboutme" title="留言" />
      </div>
    </div>
  );
}

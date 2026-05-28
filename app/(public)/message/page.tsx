import CommentList from '@/components/article/CommentList';

export const dynamic = 'force-dynamic';
export const metadata = { title: '留言板' };

export default function MessagePage() {
  return (
    <div className="space-y-6">
      <div className="card-box">
        <h1 className="text-2xl font-bold">留言板</h1>
        <p className="mt-2 text-sm text-gray-500">有什么想说的，在这里留言吧 ~</p>
      </div>
      <div className="card-box">
        <CommentList articleId="message" title="留言" />
      </div>
    </div>
  );
}

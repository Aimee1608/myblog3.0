import { getSiteStats } from '@/lib/queries';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default async function AdminHome() {
  const [stats, session] = await Promise.all([getSiteStats(), auth()]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">概览</h1>
      <p className="mb-6 text-sm text-gray-500">欢迎回来，{session?.user?.name ?? session?.user?.userId}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="已发布文章" value={stats.articles} />
        <Stat label="评论" value={stats.comments} />
      </div>
    </div>
  );
}

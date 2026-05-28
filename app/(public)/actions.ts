'use server';

import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/connect';
import { LoveModel } from '@/lib/db/models';

// Site-wide "Do you like me?" love counter (legacy `love` collection, logId='site').
export async function toggleSiteLove(): Promise<{ added: boolean }> {
  const session = await auth();
  const userId = session?.user?.userId ?? 'anonymous';
  await dbConnect();
  await LoveModel.create({ userId, logId: 'site', createDate: new Date() });
  return { added: true };
}

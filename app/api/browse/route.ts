import type { NextRequest } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/connect';
import { BrowseModel } from '@/lib/db/models';

export async function POST(req: NextRequest) {
  let articleId: string | undefined;
  try {
    const body = (await req.json()) as { articleId?: string };
    articleId = body.articleId;
  } catch {
    return Response.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (!articleId || !isValidObjectId(articleId)) {
    return Response.json({ ok: false, error: 'bad articleId' }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.userId ?? 'anon';

  await dbConnect();
  await BrowseModel.create({ userId, articleId, createDate: new Date() });
  return Response.json({ ok: true });
}

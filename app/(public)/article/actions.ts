'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/connect';
import { CommentModel, LikeModel } from '@/lib/db/models';

export async function postComment(articleId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.userId) throw new Error('请先登录');

  const content = String(formData.get('content') ?? '').trim();
  if (!content) return;

  await dbConnect();
  await CommentModel.create({
    userId: session.user.userId,
    articleId,
    content,
    state: 1,
    createDate: new Date(),
  });
  revalidatePath(`/article/${articleId}`);
}

export async function toggleLike(articleId: string) {
  const session = await auth();
  if (!session?.user?.userId) throw new Error('请先登录');

  await dbConnect();
  const existing = await LikeModel.findOne({ userId: session.user.userId, articleId });
  if (existing) {
    await LikeModel.deleteOne({ _id: existing._id });
  } else {
    await LikeModel.create({
      userId: session.user.userId,
      articleId,
      createDate: new Date(),
    });
  }
  revalidatePath(`/article/${articleId}`);
}

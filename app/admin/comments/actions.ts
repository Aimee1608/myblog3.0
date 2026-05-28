'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/connect';
import { CommentModel } from '@/lib/db/models';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error('Unauthorized');
}

export async function deleteComment(id: string) {
  await assertAdmin();
  await dbConnect();
  await CommentModel.deleteOne({ _id: id });
  revalidatePath('/admin/comments');
}

export async function setCommentState(id: string, state: number) {
  await assertAdmin();
  await dbConnect();
  await CommentModel.updateOne({ _id: id }, { $set: { state } });
  revalidatePath('/admin/comments');
}

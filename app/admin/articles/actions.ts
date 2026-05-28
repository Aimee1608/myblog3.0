'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/connect';
import { ArticleModel } from '@/lib/db/models';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error('Unauthorized');
  }
}

export async function saveArticle(id: string | null, formData: FormData) {
  await assertAdmin();
  await dbConnect();

  const data = {
    title: String(formData.get('title') ?? '').trim(),
    content: String(formData.get('content') ?? ''),
    classId: String(formData.get('classId') ?? ''),
    tags: formData.getAll('tags').map(String),
    state: Number(formData.get('state') ?? 1),
    isHot: Number(formData.get('isHot') ?? 0),
    isRecommend: Number(formData.get('isRecommend') ?? 0),
    lastModifiedDate: new Date(),
  };

  if (id) {
    await ArticleModel.updateOne({ _id: id }, { $set: data });
  } else {
    await ArticleModel.create({ ...data, createDate: new Date() });
  }

  revalidatePath('/admin/articles');
  revalidatePath('/');
  redirect('/admin/articles');
}

export async function deleteArticle(id: string) {
  await assertAdmin();
  await dbConnect();
  await ArticleModel.deleteOne({ _id: id });
  revalidatePath('/admin/articles');
  revalidatePath('/');
}

export async function toggleArticleState(id: string, nextState: number) {
  await assertAdmin();
  await dbConnect();
  await ArticleModel.updateOne(
    { _id: id },
    { $set: { state: nextState, lastModifiedDate: new Date() } },
  );
  revalidatePath('/admin/articles');
  revalidatePath('/');
}

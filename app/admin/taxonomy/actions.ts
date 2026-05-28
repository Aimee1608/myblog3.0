'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/connect';
import { ArticleCateModel, TagModel } from '@/lib/db/models';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error('Unauthorized');
}

export async function addCategory(formData: FormData) {
  await assertAdmin();
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  await dbConnect();
  await ArticleCateModel.create({ name, state: 1, createDate: new Date(), lastModifiedDate: new Date() });
  revalidatePath('/admin/taxonomy');
}

export async function deleteCategory(id: string) {
  await assertAdmin();
  await dbConnect();
  await ArticleCateModel.deleteOne({ _id: id });
  revalidatePath('/admin/taxonomy');
}

export async function addTag(formData: FormData) {
  await assertAdmin();
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  await dbConnect();
  await TagModel.create({ name, state: 1, createDate: new Date(), lastModifiedDate: new Date() });
  revalidatePath('/admin/taxonomy');
}

export async function deleteTag(id: string) {
  await assertAdmin();
  await dbConnect();
  await TagModel.deleteOne({ _id: id });
  revalidatePath('/admin/taxonomy');
}

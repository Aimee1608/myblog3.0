import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { auth } from '@/auth';

const UPLOAD_DIR = 'public/posts-images';
const URL_PREFIX = '/posts-images';
const VALID_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: 'bad form data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'no file' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return Response.json({ error: 'not an image' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'file too large (>10MB)' }, { status: 413 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 12);
  const rawExt = (file.name.split('.').pop() ?? 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
  const ext = VALID_EXT.has(rawExt) ? rawExt : 'png';
  const filename = `${Date.now()}-${hash}.${ext}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buf);

  return Response.json({ url: `${URL_PREFIX}/${filename}`, size: buf.length });
}

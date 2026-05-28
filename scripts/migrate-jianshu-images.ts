// Migrate Jianshu (简书) hot-linked images embedded in article.content to local /migrated/.
// Run from project root, after opening an SSH tunnel to the production mongo:
//   ssh -fN -L 27018:127.0.0.1:27017 myblog
//   MIGRATE_MONGODB_URI=mongodb://127.0.0.1:27018/aimeeblog \
//     DRY_RUN=1 npx tsx scripts/migrate-jianshu-images.ts   # preview
//   MIGRATE_MONGODB_URI=mongodb://127.0.0.1:27018/aimeeblog \
//     npx tsx scripts/migrate-jianshu-images.ts             # real run
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ArticleModel } from '../lib/db/models';

const URI = process.env.MIGRATE_MONGODB_URI ?? 'mongodb://127.0.0.1:27018/aimeeblog';
const DRY = !!process.env.DRY_RUN;
const OUT_DIR = 'public/migrated';
const URL_PREFIX = '/migrated';
const JIANSHU_RE = /https?:\/\/upload-images\.jianshu\.io\/[^\s)"'<>]+/g;
const VALID_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);

async function main() {
  await mongoose.connect(URI);
  console.log(`[connected] ${URI}${DRY ? '  (DRY RUN)' : ''}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const articles = await ArticleModel.find({ content: JIANSHU_RE }).lean();
  console.log(`${articles.length} 篇文章含简书图\n`);

  const cache = new Map<string, string>(); // cleanUrl -> /migrated/<hash>.<ext>
  let downloaded = 0;
  let failed = 0;
  let articlesUpdated = 0;

  for (const a of articles) {
    const content = a.content ?? '';
    const allUrls = content.match(JIANSHU_RE) ?? [];
    const uniqUrls = [...new Set(allUrls)];
    console.log(`▶ [${a.title}]  ${uniqUrls.length} URL`);

    let newContent = content;

    for (const url of uniqUrls) {
      const cleanUrl = url.split('?')[0];
      let newUrl = cache.get(cleanUrl);

      if (!newUrl) {
        const rawExt = path.extname(cleanUrl).slice(1).toLowerCase();
        const ext = VALID_EXT.has(rawExt) ? rawExt : 'png';
        const hash = crypto.createHash('md5').update(cleanUrl).digest('hex').slice(0, 12);
        const file = `${hash}.${ext}`;
        const filepath = path.join(OUT_DIR, file);

        if (!fs.existsSync(filepath)) {
          try {
            const res = await fetch(url);
            if (!res.ok) {
              console.warn(`  ✗ HTTP ${res.status}  ${cleanUrl}`);
              failed++;
              continue;
            }
            const buf = Buffer.from(await res.arrayBuffer());
            fs.writeFileSync(filepath, buf);
            console.log(`  ✓ ${file}  (${buf.length} bytes)`);
            downloaded++;
          } catch (e) {
            console.warn(`  ✗ ${cleanUrl}  ${(e as Error).message}`);
            failed++;
            continue;
          }
        } else {
          console.log(`  • ${file}  (already exists)`);
        }
        newUrl = `${URL_PREFIX}/${file}`;
        cache.set(cleanUrl, newUrl);
      }

      newContent = newContent.split(url).join(newUrl);
    }

    if (newContent !== content) {
      if (DRY) {
        console.log(`  → would update article ${a._id}`);
      } else {
        await ArticleModel.updateOne(
          { _id: a._id },
          { $set: { content: newContent, lastModifiedDate: new Date() } },
        );
        console.log(`  → updated`);
      }
      articlesUpdated++;
    }
    console.log('');
  }

  console.log(`done.  downloaded=${downloaded}  failed=${failed}  articles=${articlesUpdated}${DRY ? '  (DRY)' : ''}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});

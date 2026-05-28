// Publish a markdown file as a new article into ECS mongo (via SSH tunnel on 27018).
//
// Usage:
//   ssh -fN -L 27018:127.0.0.1:27017 myblog        # open tunnel once
//   MIGRATE_MONGODB_URI=mongodb://127.0.0.1:27018/aimeeblog \
//     npx tsx scripts/publish-post.ts \
//       --file /tmp/article-blog3.md \
//       --title "我把跑了五年的旧博客升级到了 3.0" \
//       --category "事件簿" \
//       --tags 重构,Next.js,折腾
import mongoose from 'mongoose';
import fs from 'fs';
import { ArticleModel, ArticleCateModel } from '../lib/db/models';

const URI = process.env.MIGRATE_MONGODB_URI ?? 'mongodb://127.0.0.1:27018/aimeeblog';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const file = arg('file');
const title = arg('title');
const category = arg('category');
const tagsCsv = arg('tags') ?? '';

if (!file || !title) {
  console.error(
    'Usage: tsx scripts/publish-post.ts --file <md> --title <title> [--category <name>] [--tags a,b,c]',
  );
  process.exit(1);
}

async function main() {
  const content = fs.readFileSync(file!, 'utf8');
  await mongoose.connect(URI);

  let classId = '';
  if (category) {
    const cat = await ArticleCateModel.findOne({ name: category }).lean();
    if (!cat) {
      const all = await ArticleCateModel.find({}, { name: 1 }).lean();
      console.error(`分类 "${category}" 未找到。可用分类：${all.map((c) => c.name).join(', ')}`);
      process.exit(1);
    }
    classId = String(cat._id);
  }

  const tags = tagsCsv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const doc = await ArticleModel.create({
    title,
    content,
    classId,
    tags,
    isHot: 0,
    isRecommend: 1,
    state: 1,
    createDate: new Date(),
    lastModifiedDate: new Date(),
  });

  console.log(`\n✓ 文章已发布`);
  console.log(`  id   : ${doc._id}`);
  console.log(`  title: ${title}`);
  console.log(`  cate : ${category ?? '(未分类)'}`);
  console.log(`  url  : https://mangoya.cn/article/${doc._id}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

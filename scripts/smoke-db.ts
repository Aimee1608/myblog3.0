// Smoke test: read real data through the Mongoose models to verify
// field mapping and Mongoose 8 <-> MongoDB 4.4 compatibility.
// Run: MONGODB_URI=mongodb://127.0.0.1:27017/aimeeblog npx tsx scripts/smoke-db.ts
import mongoose from 'mongoose';
import { dbConnect } from '../lib/db/connect';
import {
  ArticleModel,
  ArticleCateModel,
  TagModel,
  CommentModel,
  UserModel,
} from '../lib/db/models';

async function main() {
  await dbConnect();

  const articleCount = await ArticleModel.countDocuments();
  const latest = await ArticleModel.findOne().sort({ createDate: -1 }).lean();
  const admins = await UserModel.find({ status: { $lte: 2 } })
    .select('username status origin')
    .lean();

  console.log('--- counts ---');
  console.log('articles :', articleCount);
  console.log('cates    :', await ArticleCateModel.countDocuments());
  console.log('tags     :', await TagModel.countDocuments());
  console.log('comments :', await CommentModel.countDocuments());
  console.log('users    :', await UserModel.countDocuments());
  console.log('--- latest article ---');
  console.log('title    :', latest?.title);
  console.log('tags     :', latest?.tags);
  console.log('classId  :', latest?.classId);
  console.log('state    :', latest?.state);
  console.log('createDate:', latest?.createDate);
  console.log('content len:', latest?.content?.length);
  console.log('--- admins (status<=2) ---');
  console.log(admins);

  await mongoose.disconnect();
  console.log('\nSMOKE OK');
}

main().catch((e) => {
  console.error('SMOKE FAILED:', e);
  process.exit(1);
});

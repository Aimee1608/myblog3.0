import { Schema, model, models, type Model } from 'mongoose';

// Interaction collections share a near-identical shape in the legacy schema:
//   like / collect : { userId, articleId, createDate }
//   browse         : { userId, articleId, logId, createDate }
//   love           : { userId, logId, createDate }

export interface ILike {
  userId: string;
  articleId?: string;
  createDate: Date;
}
const LikeSchema = new Schema<ILike>(
  {
    userId: { type: String, required: true },
    articleId: { type: String },
    createDate: { type: Date, default: Date.now },
  },
  { collection: 'like' },
);
export const LikeModel: Model<ILike> =
  (models.like as Model<ILike>) || model<ILike>('like', LikeSchema);

export interface ICollect {
  userId: string;
  articleId?: string;
  createDate: Date;
}
const CollectSchema = new Schema<ICollect>(
  {
    userId: { type: String, required: true },
    articleId: { type: String },
    createDate: { type: Date, default: Date.now },
  },
  { collection: 'collect' },
);
export const CollectModel: Model<ICollect> =
  (models.collect as Model<ICollect>) || model<ICollect>('collect', CollectSchema);

export interface IBrowse {
  userId: string;
  articleId?: string;
  logId?: string;
  createDate: Date;
}
const BrowseSchema = new Schema<IBrowse>(
  {
    userId: { type: String, required: true },
    articleId: { type: String },
    logId: { type: String },
    createDate: { type: Date, default: Date.now },
  },
  { collection: 'browse' },
);
export const BrowseModel: Model<IBrowse> =
  (models.browse as Model<IBrowse>) || model<IBrowse>('browse', BrowseSchema);

export interface ILove {
  userId: string;
  logId?: string;
  createDate: Date;
}
const LoveSchema = new Schema<ILove>(
  {
    userId: { type: String, required: true },
    logId: { type: String },
    createDate: { type: Date, default: Date.now },
  },
  { collection: 'love' },
);
export const LoveModel: Model<ILove> =
  (models.love as Model<ILove>) || model<ILove>('love', LoveSchema);

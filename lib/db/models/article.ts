import { Schema, model, models, type Model } from 'mongoose';

// Mirrors the legacy `article` collection (myblog2.0-server).
export interface IArticle {
  title: string;
  content?: string;
  classId?: string; // -> articleCate._id
  tags: string[]; // -> tags._id[]
  isRecommend: number; // 0 no / 1 yes
  isHot: number; // 0 no / 1 yes
  state: number; // 1 published / 0 hidden
  createDate: Date;
  lastModifiedDate: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String },
    classId: { type: String },
    tags: { type: [String], default: [] },
    isRecommend: { type: Number, default: 1 },
    isHot: { type: Number, default: 1 },
    state: { type: Number, default: 1 },
    createDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
  },
  { collection: 'article' },
);

export const ArticleModel: Model<IArticle> =
  (models.article as Model<IArticle>) || model<IArticle>('article', ArticleSchema);

import { Schema, model, models, type Model } from 'mongoose';

// Mirrors the legacy `articleCate` collection.
export interface IArticleCate {
  name: string;
  state: number; // 1 enabled / 0 disabled
  createDate: Date;
  lastModifiedDate: Date;
}

const ArticleCateSchema = new Schema<IArticleCate>(
  {
    name: { type: String, required: true },
    state: { type: Number, default: 1 },
    createDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
  },
  { collection: 'articleCate' },
);

export const ArticleCateModel: Model<IArticleCate> =
  (models.articleCate as Model<IArticleCate>) ||
  model<IArticleCate>('articleCate', ArticleCateSchema);

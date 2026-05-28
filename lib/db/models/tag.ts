import { Schema, model, models, type Model } from 'mongoose';

// Mirrors the legacy `tags` collection.
export interface ITag {
  name: string;
  classId?: string;
  state: number; // 1 enabled / 0 disabled
  createDate: Date;
  lastModifiedDate: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true },
    classId: { type: String },
    state: { type: Number, default: 1 },
    createDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
  },
  { collection: 'tags' },
);

export const TagModel: Model<ITag> =
  (models.tags as Model<ITag>) || model<ITag>('tags', TagSchema);

import { Schema, model, models, type Model } from 'mongoose';

// Mirrors the legacy `comment` collection.
export interface IComment {
  userId: string; // -> user.userId
  articleId?: string; // -> article._id
  content?: string;
  parentId?: string; // -> comment._id (nested reply)
  state: number; // 1 visible / 0 hidden
  createDate: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: String, required: true },
    articleId: { type: String },
    content: { type: String },
    parentId: { type: String },
    state: { type: Number, default: 1 },
    createDate: { type: Date, default: Date.now },
  },
  { collection: 'comment' },
);

export const CommentModel: Model<IComment> =
  (models.comment as Model<IComment>) || model<IComment>('comment', CommentSchema);

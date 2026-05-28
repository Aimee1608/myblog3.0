import { Schema, model, models, type Model } from 'mongoose';

// Mirrors the legacy `user` collection.
// Login was via third-party OAuth (GitHub / Weibo); there is no password field.
// `status`: 1 super-admin / 2 admin / 3 normal user.
// The webBlog* fields double as the "friend links" data source.
export interface IUser {
  userId: string; // third-party id
  username: string;
  avatar?: string;
  email?: string;
  bio?: string;
  blog?: string;
  webBlogName?: string;
  webBlog?: string;
  webBlogIcon?: string;
  webBlogDesc?: string;
  webBlogState: number; // 0 not shown / 1 shown
  label?: string;
  origin?: string; // 'github' | 'weibo' | ...
  status: number; // 1 super-admin / 2 admin / 3 normal
  createDate: Date;
  lastModifiedDate: Date;
  lastLoginDate: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String },
    email: { type: String },
    bio: { type: String },
    blog: { type: String },
    webBlogName: { type: String },
    webBlog: { type: String },
    webBlogIcon: { type: String },
    webBlogDesc: { type: String },
    webBlogState: { type: Number, default: 0 },
    label: { type: String },
    origin: { type: String },
    status: { type: Number, default: 3 },
    createDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
    lastLoginDate: { type: Date, default: Date.now },
  },
  { collection: 'user' },
);

export const UserModel: Model<IUser> =
  (models.user as Model<IUser>) || model<IUser>('user', UserSchema);

import { Schema, model, models, type Model } from 'mongoose';

// Mirrors the legacy `resource` collection (uploaded files / images).
export interface IResource {
  name: string;
  md5Name?: string;
  url: string;
  userId: string;
  createDate: Date;
  lastModifiedDate: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true },
    md5Name: { type: String },
    url: { type: String, required: true },
    userId: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
  },
  { collection: 'resource' },
);

export const ResourceModel: Model<IResource> =
  (models.resource as Model<IResource>) || model<IResource>('resource', ResourceSchema);

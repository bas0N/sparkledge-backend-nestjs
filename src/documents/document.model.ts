import * as mongoose from 'mongoose';

export const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'document' },
  description: { type: String, default: 'No description' },
  createdBy: { type: String, required: true, default: 'bason' },
  creatorEmail: { type: String, required: true, default: 'bason@email.com' },
  createdDate: { type: Date, default: Date.now() },
  viewsNum: { type: Number, default: 0 },
  likesNum: { type: Number, default: 0 },
});

export interface Document {
  title: string;
  description: string;
  createdBy: string;
  creatorEmail: string;
}

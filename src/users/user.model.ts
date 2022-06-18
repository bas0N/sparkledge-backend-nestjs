import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  roles: {
    User: { type: Number, default: 2001 },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  temporaryToken: {
    type: String,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  refreshToken: { type: String },
});

export interface User {
  email: String;
  firstName: String;
  lastName: String;
  password: String;
  temporaryToken: String;
}

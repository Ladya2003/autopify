import { Schema } from 'mongoose';

export const RoleSchema = new Schema({
  name: String,
  permissions: [String],
});

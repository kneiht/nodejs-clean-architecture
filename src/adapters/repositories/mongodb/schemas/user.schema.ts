import { UserType } from '@/entities/user.entity.js';
import mongoose from 'mongoose';

// Define the User schema for MongoDB
const userSchema = new mongoose.Schema<Omit<UserType, 'id'> & { _id: string }>({
  _id: { type: String, required: true },
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

userSchema.virtual('id').get(function () {
  return this._id.toString();
});

export const UserModel = mongoose.model('users', userSchema);

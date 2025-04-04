
import { IUserInput } from '@/types'
import mongoose, { Document,model, Schema } from 'mongoose';

export interface IUser extends Document, IUserInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models.User || model<IUser>('User', userSchema);

export default User

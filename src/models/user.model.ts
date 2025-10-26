import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: false },
});

// Register the model as 'User' so other schemas can use ref: 'User' for populate()
export const User = model<IUser>('User', userSchema, 'users');

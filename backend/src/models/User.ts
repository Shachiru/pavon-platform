import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {UserRole, IUser, IUserMethods, UserModel} from '../types';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, select: false},
    role: {type: String, enum: Object.values(UserRole), default: UserRole.USER},
    googleId: {type: String},
    avatar: {type: String},
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser, UserModel>('User', userSchema);

import {Types, Document, Model} from "mongoose";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

// User document interface
export interface IUser {
    name: string;
    email: string;
    password?: string | null;
    role: UserRole;
    googleId?: string | null;
    avatar?: string | null;
}

// User methods interface
export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// User document type
export type UserDocument = Document<Types.ObjectId> & IUser & IUserMethods;

// User model type
export type UserModel = Model<IUser, {}, IUserMethods>;

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: Types.ObjectId;
                name: string;
                email: string;
                role: UserRole;
                [key: string]: any;
            };
        }
    }
}
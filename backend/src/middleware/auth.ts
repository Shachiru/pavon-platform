import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { UserRole } from '../types';

interface JwtPayload {
    id: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) return next(new AppError('Not authenticated', 401));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const user = await User.findById(decoded.id);
        if (!user) return next(new AppError('User no longer exists', 401));
        req.user = user;
        next();
    } catch (err) {
        next(new AppError('Invalid token', 401));
    }
};

export const requireRole = (role: UserRole) => {
    return (req: Request, _: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Not authenticated', 401));
        }
        if (req.user.role !== role) {
            return next(new AppError(`Requires ${role} access`, 403));
        }
        next();
    };
};
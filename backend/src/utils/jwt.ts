import jwt from 'jsonwebtoken';
import {Response} from 'express';

export const signToken = (id: string): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!secret || !expiresIn) {
        throw new Error('JWT_SECRET and JWT_EXPIRES_IN must be defined');
    }

    return jwt.sign({ id }, secret, { expiresIn: expiresIn as any });
};

export const setAuthCookie = (res: Response, token: string) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
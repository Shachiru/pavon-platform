import {Request, Response} from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import {signToken, setAuthCookie} from '../utils/jwt';
import {isWhitelistedAdmin} from '../utils/isAdminEmail';
import {UserRole} from '../types';
import {catchAsync} from '../utils/catchAsync';

export const signup = catchAsync(async (req: Request, res: Response) => {
    const {name, email, password} = req.body;
    const role = isWhitelistedAdmin(email) ? UserRole.ADMIN : UserRole.USER;

    const existing = await User.findOne({email});
    if (existing) throw new AppError('Email already in use', 400);

    const user = await User.create({name, email, password, role});
    const token = signToken(user._id.toString());
    setAuthCookie(res, token);

    res.status(201).json({
        status: 'success',
        token,
        data: {user: {id: user._id, name, email, role}},
    });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');
    if (!user || !user.password) {
        throw new AppError('Invalid email or password', 401);
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new AppError('Invalid email or password', 401);
    }

    const token = signToken(user._id.toString());
    setAuthCookie(res, token);

    res.status(200).json({
        token,
        status: 'success',
        data: {user: {id: user._id, name: user.name, email, role: user.role}},
    });
});

export const logout = (req: Request, res: Response) => {
    res.clearCookie('jwt', {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict'});
    res.status(200).json({status: 'success'});
};

export const getMe = catchAsync(async (req: Request, res: Response) => {
    res.status(200).json({status: 'success', data: {user: req.user}});
});
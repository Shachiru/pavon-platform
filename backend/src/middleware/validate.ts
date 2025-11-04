import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import AppError from '../utils/AppError';

export const validate = (schema: ZodSchema) => {
    return (req: Request, _: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map(e => `${e.path}: ${e.message}`).join(', ');
            return next(new AppError(errors, 400));
        }
        req.body = result.data;
        next();
    };
};
import { Router } from 'express';
import { signup, login, logout, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../validators/authValidator';
import passport from '../config/passport';

const router = Router();

router.post('/signup', validate(signupSchema), authLimiter, signup);
router.post('/login', validate(loginSchema), authLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = require('../utils/jwt').signToken((req.user as any)._id);
        require('../utils/jwt').setAuthCookie(res, token);
        res.redirect(`${process.env.FRONTEND_URL}`);
    }
);

export default router;
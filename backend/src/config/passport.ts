import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import User from '../models/User';
import {UserRole} from '../types';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({googleId: profile.id});
                if (user) return done(null, user);

                const email = profile.emails?.[0].value;
                if (!email) return done(new Error('No email from Google'));

                if (process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()).includes(email)) {
                    return done(new Error('Admin must use email/password'), false);
                }

                user = await User.create({
                    name: profile.displayName,
                    email,
                    googleId: profile.id,
                    role: UserRole.USER,
                    avatar: profile.photos?.[0].value,
                });

                done(null, user);
            } catch (err) {
                done(err);
            }
        }
    )
);

passport.serializeUser((user: any, done) => done(null, user._id));
passport.deserializeUser(async (id: string, done) => {
    const user = await User.findById(id);
    done(null, user);
});

export default passport;
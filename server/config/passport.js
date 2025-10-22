import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/userModel.js';

export const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/v1/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists with this Google ID
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // User exists, return the user
                        return done(null, user);
                    }

                    // Check if user exists with the same email
                    user = await User.findOne({ email: profile.emails[0].value, accountVerified: true });

                    if (user) {
                        // Link Google account to existing user
                        user.googleId = profile.id;
                        user.authProvider = 'google';
                        await user.save({ validateBeforeSave: false });
                        return done(null, user);
                    }

                    // Create new user
                    const newUser = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        authProvider: 'google',
                        accountVerified: true,
                        avatar: {
                            url: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
                        },
                    });

                    return done(null, newUser);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

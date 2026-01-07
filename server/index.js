import dotenv from 'dotenv';
dotenv.config(); // Load env first

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';

const PORT = process.env.PORT || 8000;
const app = express();

// Configure Passport AFTER dotenv is loaded
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          return done(null, user);
        }

        user = await User.create({
          fullname: profile.displayName,
          email: profile.emails[0].value,
          password: 'google-oauth-' + profile.id,
          googleId: profile.id,
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/blog", blogRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(error));
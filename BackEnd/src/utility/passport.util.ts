import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { env } from "../config/env.config";
import { UserRepository } from "../repository/implementation/UserRepository";
import { Request } from "express";
import { IRole } from "../types/user.types";
import { Types } from "mongoose";

const userRepo = new UserRepository();

const clientID = env.CLIENT_ID as string;
const clientSecret = env.CLIENT_SECRET as string;
const callBack = env.CALLBACK_URL as string;
console.log(callBack, "callback");

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callBack,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const role = (req.session.role as IRole) || "learner";
        const user = await userRepo.findOrCreateUser(profile, role);
        if (!user) {
          throw new Error("Internal Error");
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id: unknown, done) => {
  try {
    const userId = id as Types.ObjectId;
    const user = await userRepo.findById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;

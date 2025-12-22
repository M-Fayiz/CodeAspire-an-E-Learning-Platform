"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_config_1 = require("../config/env.config");
const UserRepository_1 = require("../repository/implementation/UserRepository");
const userRepo = new UserRepository_1.UserRepository();
const clientID = env_config_1.env.CLIENT_ID;
const clientSecret = env_config_1.env.CLIENT_SECRET;
const callBack = env_config_1.env.CALLBACK_URL;
if (clientID && clientSecret && callBack) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID,
        clientSecret,
        callbackURL: callBack,
        passReqToCallback: true,
    }, async (req, _accessToken, _refreshToken, profile, done) => {
        try {
            const state = req.query.state
                ? JSON.parse(req.query.state)
                : {};
            const role = state.role || "learner";
            const user = await userRepo.findOrCreateUser(profile, role);
            if (!user) {
                throw new Error("Internal Error");
            }
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
}
else {
    console.warn("⚠️ Google OAuth disabled: missing environment variables");
}
exports.default = passport_1.default;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.verifyAccesToken = verifyAccesToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const ACCESS_TOKEN = env_config_1.env.ACCESS_TOKEN;
const REFRESH_TOKEN = env_config_1.env.REFRESH_TOKEN;
// const accesTokenExpirAt=env.ACCESS_TOKEN_MAX_AGE as string
// const refreshTokenExpireAt=env.REFRESH_TOKEN_MAX_AGE as string
function generateTokens(payload) {
    const accessToken = jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}
function verifyAccesToken(token) {
    return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, REFRESH_TOKEN);
}

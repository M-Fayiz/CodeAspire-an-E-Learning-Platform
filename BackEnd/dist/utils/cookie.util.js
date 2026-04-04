"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshToken = exports.setAccessToken = void 0;
const auth_const_1 = require("../const/auth.const");
const cookie_config_1 = require("../config/cookie.config");
const env_config_1 = require("../config/env.config");
const accessTokenMaxAge = Number(env_config_1.env.ACCESS_TOKEN_MAX_AGE ?? 15 * 60 * 1000) || 15 * 60 * 1000;
const refreshTokenMaxAge = Number(env_config_1.env.REFRESH_TOKEN_MAX_AGE ?? 7 * 24 * 60 * 60 * 1000) ||
    7 * 24 * 60 * 60 * 1000;
const setAccessToken = (res, token) => {
    res.cookie(auth_const_1.AUTH_TOKEN.ACCESS_TOKEN, token, {
        ...cookie_config_1.cookieOptions,
        maxAge: accessTokenMaxAge,
    });
};
exports.setAccessToken = setAccessToken;
const setRefreshToken = (res, token) => {
    res.cookie(auth_const_1.AUTH_TOKEN.REFRESH_TOKEN, token, {
        ...cookie_config_1.cookieOptions,
        maxAge: refreshTokenMaxAge,
    });
};
exports.setRefreshToken = setRefreshToken;

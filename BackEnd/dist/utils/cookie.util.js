"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshToken = exports.setAccessToken = void 0;
const auth_const_1 = require("../const/auth.const");
const setAccessToken = (res, token) => {
    res.cookie(auth_const_1.AUTH_TOKEN.ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: false,
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        domain: undefined,
        maxAge: 15 * 60 * 1000,
        path: "/",
    });
};
exports.setAccessToken = setAccessToken;
const setRefreshToken = (res, token) => {
    res.cookie(auth_const_1.AUTH_TOKEN.REFRESH_TOKEN, token, {
        httpOnly: true,
        secure: false,
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        domain: undefined,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
};
exports.setRefreshToken = setRefreshToken;

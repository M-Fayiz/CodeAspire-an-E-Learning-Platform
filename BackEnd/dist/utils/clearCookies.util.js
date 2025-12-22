"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookies = void 0;
const auth_const_1 = require("../const/auth.const");
const clearCookies = (res) => {
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        domain: undefined,
        path: "/",
    };
    res.clearCookie(auth_const_1.AUTH_TOKEN.ACCESS_TOKEN, options);
    res.clearCookie(auth_const_1.AUTH_TOKEN.REFRESH_TOKEN, options);
};
exports.clearCookies = clearCookies;

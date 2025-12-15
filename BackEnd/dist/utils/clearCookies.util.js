"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookies = void 0;
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
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
};
exports.clearCookies = clearCookies;

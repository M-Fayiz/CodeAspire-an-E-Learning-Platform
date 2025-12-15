"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
exports.options = {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    domain: undefined,
    path: "/",
};

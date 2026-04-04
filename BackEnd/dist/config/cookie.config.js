"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = void 0;
const env_config_1 = require("./env.config");
const isProduction = env_config_1.env.NODE_ENV === "production";
exports.cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: undefined,
    path: "/",
};

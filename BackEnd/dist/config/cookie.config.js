"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = void 0;
const env_config_1 = require("./env.config");
const isLocalClient = [env_config_1.env.CLIENT_ORGIN, env_config_1.env.CLIENT_URL_2].some((origin) => /localhost|127\.0\.0\.1/i.test(origin ?? ""));
const isProduction = env_config_1.env.NODE_ENV === "production" && !isLocalClient;
exports.cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: undefined,
    path: "/",
};

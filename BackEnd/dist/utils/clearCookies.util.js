"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookies = void 0;
const auth_const_1 = require("../const/auth.const");
const cookie_config_1 = require("../config/cookie.config");
const clearCookies = (res) => {
    res.clearCookie(auth_const_1.AUTH_TOKEN.ACCESS_TOKEN, cookie_config_1.cookieOptions);
    res.clearCookie(auth_const_1.AUTH_TOKEN.REFRESH_TOKEN, cookie_config_1.cookieOptions);
};
exports.clearCookies = clearCookies;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisPrefix = void 0;
var redisPrefix;
(function (redisPrefix) {
    redisPrefix["FORGOT_PASSWORD"] = "forgot-email";
    redisPrefix["VERIFY_EMAIL"] = "verifyEmail";
    redisPrefix["ONLINE_USERS"] = "Online_Users";
    redisPrefix["OFFLINE_USERS"] = "Offline_Users";
})(redisPrefix || (exports.redisPrefix = redisPrefix = {}));

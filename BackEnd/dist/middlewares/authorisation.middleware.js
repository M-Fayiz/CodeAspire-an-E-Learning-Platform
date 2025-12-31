"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizedRole = authorizedRole;
const http_error_1 = require("../utils/http-error");
const http_status_const_1 = require("../const/http-status.const");
const error_message_const_1 = require("../const/error-message.const");
function authorizedRole(...allowedRole) {
    return function (req, res, next) {
        try {
            const user = req.user;
            if (!user) {
                throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.UNAUTHORIZED, error_message_const_1.HttpResponse.UNAUTHORIZED);
            }
            if (!allowedRole.includes(user.role)) {
                throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.LOCKED, error_message_const_1.HttpResponse.ACCESS_DENIED);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}

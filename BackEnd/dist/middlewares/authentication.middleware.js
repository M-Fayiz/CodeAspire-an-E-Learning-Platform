"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = verifyUser;
const user_model_1 = require("../models/user.model");
const http_error_1 = require("../utils/http-error");
const http_status_1 = require("../const/http-status");
const error_message_1 = require("../const/error-message");
const jwt_token_util_1 = require("../utils/jwt-token.util");
async function verifyUser(req, res, next) {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.UNAUTHORIZED, error_message_1.HttpResponse.UNAUTHORIZED);
        }
        const decode = (0, jwt_token_util_1.verifyAccesToken)(accessToken);
        if (!decode) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.UNAUTHORIZED, error_message_1.HttpResponse.ACCESS_TOKEN_EXPIRED);
        }
        const user = await user_model_1.UserModel.findOne({ email: decode.email });
        if (!user || !user?.isActive) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.FORBIDDEN, error_message_1.HttpResponse.USER_BLOCKED);
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
}

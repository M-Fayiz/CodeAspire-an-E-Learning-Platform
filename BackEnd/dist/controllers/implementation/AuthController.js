"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = require("../../const/http-status");
const error_message_1 = require("../../const/error-message");
const response_util_1 = require("../../utils/response.util");
const cookie_config_1 = require("../../config/cookie.config");
const http_error_1 = require("../../utils/http-error");
const clearCookies_util_1 = require("../../utils/clearCookies.util");
const cookie_util_1 = require("../../utils/cookie.util");
const env_config_1 = require("../../config/env.config");
class AuthController {
    constructor(_authSerive) {
        this._authSerive = _authSerive;
    }
    async signUp(req, res, next) {
        try {
            const email = await this._authSerive.signUp(req.body);
            res
                .status(http_status_1.HttpStatus.OK)
                .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { email: email }));
        }
        catch (error) {
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            console.log('verify email', req.body);
            const token = await this._authSerive.verifyEmail(req.body);
            (0, cookie_util_1.setAccessToken)(res, token.accessToken);
            (0, cookie_util_1.setRefreshToken)(res, token.refreshToken);
            res.status(http_status_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_1.HttpResponse.LOGGED_IN_SUCCESSFULLY, {
                token: token.accessToken,
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async authMe(req, res, next) {
        try {
            const { accessToken } = req.cookies;
            if (!accessToken) {
                return next((0, http_error_1.createHttpError)(http_status_1.HttpStatus.UNAUTHORIZED, error_message_1.HttpResponse.ACCESS_TOKEN_EXPIRED));
            }
            const user = await this._authSerive.authMe(accessToken);
            res
                .status(http_status_1.HttpStatus.OK)
                .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { user: user, token: accessToken }));
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.FORBIDDEN, error_message_1.HttpResponse.REFRESH_TOKEN_EXPIRED);
            }
            const { newAccessToken, payload } = await this._authSerive.refreshAccessToken(refreshToken);
            res.cookie("accessToken", newAccessToken, {
                ...cookie_config_1.options,
                maxAge: Number(env_config_1.env.ACCESS_TOKEN_MAX_AGE_TIME) * 60 * 1000,
            });
            res
                .status(http_status_1.HttpStatus.OK)
                .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { user: payload }));
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const tokensAndUserData = await this._authSerive.login(email, password);
            (0, cookie_util_1.setAccessToken)(res, tokensAndUserData.accessToken);
            (0, cookie_util_1.setRefreshToken)(res, tokensAndUserData.refreshToken);
            res.status(http_status_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_1.HttpResponse.LOGGED_IN_SUCCESSFULLY, {
                data: tokensAndUserData.MappedUser,
                token: tokensAndUserData.accessToken,
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            (0, clearCookies_util_1.clearCookies)(res);
            res.status(http_status_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_1.HttpResponse.LOGGED_OUT));
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const email = await this._authSerive.forgotPassword(req.body.email);
            res
                .status(http_status_1.HttpStatus.OK)
                .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { email: email }));
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        console.log(req.body);
        try {
            const { email, token, password } = req.body;
            const response = await this._authSerive.resetPassword(email, token, password);
            res
                .status(http_status_1.HttpStatus.OK)
                .json((0, response_util_1.successResponse)(error_message_1.HttpResponse.OK, { email: response }));
        }
        catch (error) {
            next(error);
        }
    }
    async googleAuthRedirection(req, res, next) {
        try {
            // if (!req.user) {
            //   res.status(HttpStatus.FORBIDDEN).json(HttpResponse.INVALID_CREDNTIALS);
            //   return;
            // }
            const Data = await this._authSerive.generateToken(req.user);
            (0, cookie_util_1.setAccessToken)(res, Data.accessToken);
            (0, cookie_util_1.setRefreshToken)(res, Data.refreshToken);
            res.redirect(`${env_config_1.env.CLIENT_ORGIN}/?token=${Data.accessToken}`);
        }
        catch (error) {
            res.redirect(`${env_config_1.env.CLIENT_ORGIN}/auth/signup`);
            next(error);
        }
    }
}
exports.AuthController = AuthController;

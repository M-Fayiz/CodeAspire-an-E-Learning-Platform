"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_types_1 = require("../../types/user.types");
const bcrypt_util_1 = require("../../utils/bcrypt.util");
const send_mail_util_1 = require("../../utils/send-mail.util");
const uuid_1 = require("uuid");
const redis_config_1 = __importDefault(require("../../config/redis.config"));
const http_status_const_1 = require("../../const/http-status.const");
const error_message_const_1 = require("../../const/error-message.const");
const http_error_1 = require("../../utils/http-error");
const jwt_token_util_1 = require("../../utils/jwt-token.util");
const jwt_token_util_2 = require("../../utils/jwt-token.util");
const crypto_util_1 = require("../../utils/crypto.util");
const redisKey_const_1 = require("../../const/redisKey.const");
const user_dto_1 = require("../../dtos/user.dto");
const payload_dto_1 = require("../../dtos/payload.dto");
const logger_config_1 = __importDefault(require("../../config/logger.config"));
class AuthService {
    constructor(_userRepo) {
        this._userRepo = _userRepo;
    }
    async signUp(user) {
        const isUserExist = await this._userRepo.findUserByEmail(user.email);
        if (isUserExist) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.CONFLICT, error_message_const_1.HttpResponse.USER_EXIST);
        }
        user.password = await (0, bcrypt_util_1.hashPassword)(user.password);
        const token = (0, uuid_1.v4)();
        await (0, send_mail_util_1.sendToken)(user.email, token, "verify-email");
        const key = `${redisKey_const_1.redisPrefix.VERIFY_EMAIL}:${token}`;
        const response = await redis_config_1.default.setEx(key, 300, JSON.stringify(user));
        if (!response) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        return user.email;
    }
    async verifyEmail(data) {
        const key = `${redisKey_const_1.redisPrefix.VERIFY_EMAIL}:${data.token}`;
        const result = await redis_config_1.default.get(key);
        if (!result) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.UNAUTHORIZED, error_message_const_1.HttpResponse.USER_CREATION_FAILED);
        }
        const storedData = JSON.parse(result);
        const user = {
            name: storedData.name,
            email: storedData.email,
            phone: storedData.phone,
            password: storedData.password,
            role: storedData.role,
            isActive: true,
            ApprovalStatus: user_types_1.mentorApprovalStatus.PENDING,
            isRequested: false,
        };
        const newUser = await this._userRepo.createUser(user);
        await redis_config_1.default.del(key);
        if (!newUser) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.CONFLICT, error_message_const_1.HttpResponse.USER_CREATION_FAILED);
        }
        const payload = (0, payload_dto_1.payloadDTO)(newUser);
        return (0, jwt_token_util_1.generateTokens)(payload);
    }
    async authMe(token) {
        const decode = (0, jwt_token_util_2.verifyAccesToken)(token);
        if (!decode) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.UNAUTHORIZED, error_message_const_1.HttpResponse.ACCESS_TOKEN_EXPIRED);
        }
        const user = await this._userRepo.findUserByEmail(decode.email);
        if (!user) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.USER_NOT_FOUND);
        }
        if (!user.isActive) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.LOCKED, error_message_const_1.HttpResponse.USER_BLOCKED);
        }
        return (0, user_dto_1.userDTO)(user);
    }
    async refreshAccessToken(token) {
        if (!token) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.USER_NOT_FOUND);
        }
        const decode = (0, jwt_token_util_2.verifyRefreshToken)(token);
        if (!decode) {
            logger_config_1.default.warn('refresh expired');
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.UNAUTHORIZED, error_message_const_1.HttpResponse.REFRESH_TOKEN_EXPIRED);
        }
        const user = await this._userRepo.findUserByEmail(decode.email);
        if (!user?.isActive) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.LOCKED, error_message_const_1.HttpResponse.USER_BLOCKED);
        }
        const payload = (0, payload_dto_1.payloadDTO)(user);
        const { accessToken } = (0, jwt_token_util_1.generateTokens)(payload);
        const newAccessToken = accessToken;
        return { newAccessToken, payload };
    }
    async login(email, password) {
        const user = await this._userRepo.findUserByEmail(email);
        if (!user) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.USER_NOT_FOUND);
        }
        if (!user.isActive) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.FORBIDDEN, error_message_const_1.HttpResponse.USER_BLOCKED);
        }
        const isMatch = await (0, bcrypt_util_1.comparePassword)(password, user.password);
        if (!isMatch) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_CREDNTIALS);
        }
        const MappedUser = (0, user_dto_1.userDTO)(user);
        const { accessToken, refreshToken } = (0, jwt_token_util_1.generateTokens)((0, payload_dto_1.payloadDTO)(user));
        return { accessToken, refreshToken, MappedUser };
    }
    async forgotPassword(email) {
        const isUserExist = await this._userRepo.findUserByEmail(email);
        if (!isUserExist) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.USER_NOT_FOUND);
        }
        const secureToken = (0, crypto_util_1.generateSecureToken)();
        const key = `${redisKey_const_1.redisPrefix.FORGOT_PASSWORD}:${email}`;
        await (0, send_mail_util_1.sendToken)(email, secureToken, "reset-password");
        const response = await redis_config_1.default.setEx(key, 300, secureToken);
        if (!response) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        return email;
    }
    async resetPassword(email, token, password) {
        const key = `${redisKey_const_1.redisPrefix.FORGOT_PASSWORD}:${email}`;
        const storedToken = await redis_config_1.default.get(key);
        if (!storedToken) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.TOKEN_NOT_FOUND);
        }
        if (storedToken !== token) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.FORBIDDEN, error_message_const_1.HttpResponse.UNAUTHORIZED);
        }
        const hashedPassword = await (0, bcrypt_util_1.hashPassword)(password);
        const result = await this._userRepo.updateUserPassword(email, hashedPassword);
        if (!result) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        await redis_config_1.default.del(key);
        return result.email;
    }
    async generateToken(user) {
        const payload = {
            _id: user._id,
            email: user.email,
            role: user.role,
            ApprovalStatus: user.ApprovalStatus,
        };
        const { accessToken, refreshToken } = (0, jwt_token_util_1.generateTokens)(payload);
        return { accessToken, refreshToken, payload };
    }
}
exports.AuthService = AuthService;

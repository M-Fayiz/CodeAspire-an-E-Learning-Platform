"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_message_1 = require("../const/error-message");
const http_status_1 = require("../const/http-status");
const http_error_1 = require("../utils/http-error");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const errorHandler = (err, req, res, next) => {
    let statusCode = http_status_1.HttpStatus.INTERNAL_SERVER_ERROR;
    let message = error_message_1.HttpResponse.SERVER_ERROR;
    if (err instanceof http_error_1.HttpError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    logger_config_1.default.error("error from middleware", err);
    res.status(statusCode).json({ error: message });
};
exports.errorHandler = errorHandler;

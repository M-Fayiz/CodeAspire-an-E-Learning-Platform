"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
const createHttpError = (statusCode, message) => {
    const errorResponse = new HttpError(statusCode, message);
    console.log("error response from server ", errorResponse);
    return errorResponse;
};
exports.createHttpError = createHttpError;

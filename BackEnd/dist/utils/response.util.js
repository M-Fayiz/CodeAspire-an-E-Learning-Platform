"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = void 0;
const successResponse = (message, data = {}) => {
    return { success: true, message: message, ...data };
};
exports.successResponse = successResponse;

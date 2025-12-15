"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadDTO = void 0;
const payloadDTO = (user) => {
    return {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
};
exports.payloadDTO = payloadDTO;

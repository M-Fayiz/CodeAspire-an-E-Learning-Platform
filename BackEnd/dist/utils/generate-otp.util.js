"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    let otp = "";
    for (let i = 1; i <= 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};
exports.generateOtp = generateOtp;

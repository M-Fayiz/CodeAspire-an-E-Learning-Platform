"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecureToken = generateSecureToken;
exports.hashSecureToken = hashSecureToken;
const crypto_1 = __importDefault(require("crypto"));
function generateSecureToken() {
    return crypto_1.default.randomBytes(64).toString("hex");
}
function hashSecureToken(token) {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
}

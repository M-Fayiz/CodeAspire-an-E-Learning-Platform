"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
exports.comparePassword = comparePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_config_1 = require("../config/env.config");
const hashPassword = async (pass) => {
    return await bcrypt_1.default.hash(pass, Number(env_config_1.env.HASH_SALT));
};
exports.hashPassword = hashPassword;
async function comparePassword(pass, hashed) {
    return await bcrypt_1.default.compare(pass, hashed);
}

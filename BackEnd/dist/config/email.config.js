"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("./env.config");
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: env_config_1.env.EMAIL,
        pass: env_config_1.env.PASS_KEY,
    },
});
exports.default = transport;

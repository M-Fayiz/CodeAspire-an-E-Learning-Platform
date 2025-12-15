"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const env_config_1 = require("./env.config");
const isDev = process.env.NODE_ENV !== "production";
const logger = (0, winston_1.createLogger)({
    level: isDev ? "debug" : "info",
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), isDev ? winston_1.format.colorize({ all: true }) : winston_1.format.json(), winston_1.format.printf(({ level, message, timestamp, ...meta }) => {
        return isDev
            ? `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`
            : JSON.stringify({ timestamp, level, message, ...meta });
    })),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: "logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: env_config_1.env.LOGGER_MAX_SIZE,
            maxFiles: env_config_1.env.LOGGER_MAX_FILES,
            zippedArchive: true,
            level: "info",
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: env_config_1.env.LOGGER_MAX_SIZE,
            maxFiles: env_config_1.env.LOGGER_MAX_FILES,
            zippedArchive: true,
            level: "error",
        }),
    ],
});
exports.default = logger;

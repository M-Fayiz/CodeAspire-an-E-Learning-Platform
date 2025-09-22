import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "./env.config";

const isDev = process.env.NODE_ENV !== "production";

const logger = createLogger({
  level: isDev ? "debug" : "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    isDev ? format.colorize({ all: true }) : format.json(),
    format.printf(({ level, message, timestamp, ...meta }) => {
      return isDev
        ? `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`
        : JSON.stringify({ timestamp, level, message, ...meta });
    }),
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: env.LOGGER_MAX_SIZE,
      maxFiles: env.LOGGER_MAX_FILES,
      zippedArchive: true,
    }),
  ],
});

export default logger;

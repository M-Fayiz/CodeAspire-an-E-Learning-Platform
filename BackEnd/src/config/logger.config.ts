import { all } from "axios";
import { createLogger, transports, format } from "winston";
import { allColors } from "winston/lib/winston/config";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(allColors),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});
export default logger;

import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../const/error-message.const";
import { HttpStatus } from "../const/http-status.const";
import { HttpError } from "../utils/http-error";
import logger from "../config/logger.config";

export const errorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message: string = HttpResponse.SERVER_ERROR;

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  logger.error("error from middleware", err);

  res.status(statusCode).json({ error: message });
};

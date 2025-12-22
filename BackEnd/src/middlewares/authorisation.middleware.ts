import { NextFunction, Request, Response } from "express";
import { createHttpError } from "../utils/http-error";
import { HttpStatus } from "../const/http-status.const";
import { HttpResponse } from "../const/error-message.const";
import { IAnyUser, IRole } from "../types/user.types";

export function authorizedRole(...allowedRole: IRole[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IAnyUser;
      if (!user) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          HttpResponse.UNAUTHORIZED,
        );
      }
      if (!allowedRole.includes(user.role)) {
        throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.ACCESS_DENIED);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

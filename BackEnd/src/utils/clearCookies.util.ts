import { Response } from "express";
import { AUTH_TOKEN } from "../const/auth.const";
import { cookieOptions } from "../config/cookie.config";

export const clearCookies = (res: Response) => {
  res.clearCookie(AUTH_TOKEN.ACCESS_TOKEN, cookieOptions);
  res.clearCookie(AUTH_TOKEN.REFRESH_TOKEN, cookieOptions);
};

import { Response } from "express";
import { AUTH_TOKEN } from "../const/auth.const";
import { cookieOptions } from "../config/cookie.config";
import { env } from "../config/env.config";

const accessTokenMaxAge =
  Number(env.ACCESS_TOKEN_MAX_AGE ?? 15 * 60 * 1000) || 15 * 60 * 1000;
const refreshTokenMaxAge =
  Number(env.REFRESH_TOKEN_MAX_AGE ?? 7 * 24 * 60 * 60 * 1000) ||
  7 * 24 * 60 * 60 * 1000;

export const setAccessToken = (res: Response, token: string) => {
  res.cookie(AUTH_TOKEN.ACCESS_TOKEN, token, {
    ...cookieOptions,
    maxAge: accessTokenMaxAge,
  });
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie(AUTH_TOKEN.REFRESH_TOKEN, token, {
    ...cookieOptions,
    maxAge: refreshTokenMaxAge,
  });
};

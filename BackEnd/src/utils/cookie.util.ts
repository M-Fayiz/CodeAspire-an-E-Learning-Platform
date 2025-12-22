import { Response } from "express";
import { AUTH_TOKEN } from "../const/auth.const";

export const setAccessToken = (res: Response, token: string) => {
  res.cookie(AUTH_TOKEN.ACCESS_TOKEN, token, {
    httpOnly: true,
    secure: false,
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
    domain: undefined,
    maxAge: 15 * 60 * 1000,
    path: "/",
  });
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie(AUTH_TOKEN.REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: false,
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
    domain: undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

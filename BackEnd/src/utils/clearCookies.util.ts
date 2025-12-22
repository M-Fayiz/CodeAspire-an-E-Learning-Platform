import { Response } from "express";
import { AUTH_TOKEN } from "../const/auth.const";

export const clearCookies = (res: Response) => {
  const options = {
    httpOnly: true,
    secure: false,
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
    domain: undefined,
    path: "/",
  };

  res.clearCookie(AUTH_TOKEN.ACCESS_TOKEN, options);
  res.clearCookie(AUTH_TOKEN.REFRESH_TOKEN, options);
};

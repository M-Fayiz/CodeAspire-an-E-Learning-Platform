import { env } from "./env.config";

const isProduction = env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  domain: undefined,
  path: "/",
};

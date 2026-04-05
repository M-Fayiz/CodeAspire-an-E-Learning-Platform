import { env } from "./env.config";

const isLocalClient = [env.CLIENT_ORGIN, env.CLIENT_URL_2].some((origin) =>
  /localhost|127\.0\.0\.1/i.test(origin ?? ""),
);
const isProduction = env.NODE_ENV === "production" && !isLocalClient;

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  domain: undefined,
  path: "/",
};

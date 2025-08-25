import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.config";

const ACCESS_TOKEN = env.ACCESS_TOKEN as string;
const REFRESH_TOKEN = env.REFRESH_TOKEN as string;

export function generateTokens(payload: object) {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: "2m" });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN, { expiresIn: "7d" });

  return { accessToken, refreshToken };
}

export function verifyAccesToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_TOKEN) as JwtPayload;
}
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_TOKEN) as JwtPayload;
}

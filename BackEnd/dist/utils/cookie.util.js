"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshToken = exports.setAccessToken = void 0;
const setAccessToken = (res, token) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: undefined,
    maxAge: 15 * 60 * 1000,
    path: "/",
  });
};
exports.setAccessToken = setAccessToken;
const setRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};
exports.setRefreshToken = setRefreshToken;

// utils/cookies.ts
import { Response } from "express";

const isProd = process.env.NODE_ENV === "production";

export const setAccessCookie = (res: Response, accessToken: string) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,          // true only over HTTPS in production
    sameSite: isProd ? "none" : "lax", // "none" needed for cross-site in prod, "lax" fine for local dev
    maxAge: 15 * 60 * 1000,  // 15 minutes, matches ACCESS_EXPIRES
    path: "/",
  });
};

export const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days, matches REFRESH_EXPIRES
    path: "/",                        // or "/api/auth/refresh" to restrict scope
  });
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../modules/users/user.model"


export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as {
      id: string;
      role: "user" | "admin" | "moderator";
      tokenVersion: number;
    };

    const user = await User.findOne({ _id: decoded.id, deletedAt: { $exists: false } }).select(
      "refreshTokenVersion isBanned isActive"
    );

    if (!user || user.isBanned || !user.isActive) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (user.refreshTokenVersion !== decoded.tokenVersion) {
      res.status(401).json({ success: false, message: "Token expired, please log in again" });
      return;
    }

    req.user = { id: decoded.id, role: decoded.role, tokenVersion: decoded.tokenVersion };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
    return;
  }
};

import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserModel, { IUserDocument } from "../users/user.model";
import { signAccessToken } from "../../utils/access-token";
import { signRefreshToken } from "../../utils/refresh-token";
import { LOCK_TIME_MS, MAX_FAILED_ATTEMPTS } from "../../constant/auth/constant.auth";
import { setRefreshCookie } from "../../utils/set-cookie";







const loginUser = async (req: Request, res: Response) => {

  try {
    const { email, password } = req.body;
    console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET , email,password);

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() })
      .select("+passwordHash");
      

    if (!user || user.authProvider !== "local") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isBanned) return res.status(403).json({ message: "Account banned" });
    if (user.deletedAt) return res.status(403).json({ message: "Account deleted" });

    // Lockout check
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minsLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return res.status(423).json({ message: `Account locked. Try again in ${minsLeft} min` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_TIME_MS);
        user.failedLoginAttempts = 0;
      }
      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    }
    

    // Success: reset failed attempts, update login metadata
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

  console.log("token",user);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    console.log(accessToken, refreshToken)
    
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      user: user.toPublicJSON(),
      accessToken,
    });
  } catch (err) {
    console.error("[loginUser]", err);
    return res.status(500).json({ message: "Internal server error",error:err.message });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let payload: { sub: string; v: number };
    try {
      payload = jwt.verify(token,process.env.REFRESH_SECRET) as { sub: string; v: number };
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const user = await UserModel.findById(payload.sub);
    if (!user || user.refreshTokenVersion !== payload.v) {
      
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    const accessToken = signAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error("[refreshAccessToken]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("[logoutUser]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Logs out ALL devices/sessions by bumping refreshTokenVersion
const logoutAllDevices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    await UserModel.findByIdAndUpdate(userId, { $inc: { refreshTokenVersion: 1 } });
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(200).json({ message: "Logged out from all devices" });
  } catch (err) {
    console.error("[logoutAllDevices]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; 
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await UserModel.findById(userId).select("+passwordHash");
    if (!user || user.authProvider !== "local") {
      return res.status(400).json({ message: "Password change not available for this account" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    user.passwordHash = newPassword; // re-hashed by pre-save hook
    user.refreshTokenVersion += 1;   // invalidate all existing refresh tokens
    await user.save();

    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(200).json({ message: "Password changed. Please log in again." });
  } catch (err) {
    console.error("[changePassword]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    // Always return 200 to avoid leaking which emails exist
    if (!user || user.authProvider !== "local") {
      return res.status(200).json({ message: "If that email exists, a reset link was sent" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await user.save();

    // TODO: send rawToken via email service (not the hashed version)
    // await sendResetEmail(user.email, rawToken);

    return res.status(200).json({ message: "If that email exists, a reset link was sent" });
  } catch (err) {
    console.error("[forgotPassword]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "token and newPassword are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken");

    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.passwordHash = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokenVersion += 1; // invalidate old sessions
    await user.save();

    return res.status(200).json({ message: "Password reset successful. Please log in." });
  } catch (err) {
    console.error("[resetPassword]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authController = {
 
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  changePassword,
  forgotPassword,
  resetPassword,
};
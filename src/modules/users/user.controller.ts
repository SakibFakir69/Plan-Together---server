import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../helper/async-helper";
import { ALLOWED_UPDATE_FIELDS } from "../../constant/users/constant.user";
import User from "../users/user.model";
import { RegisterInput, UpdateProfileInput } from "./user.validation";
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const createUser = asyncHandler(async (req: Request, res: Response) => {
  
  const { email, password, name, username, phone, locale } = req.body as RegisterInput;
  

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ success: false, message: "Email already in use" });
    return;
  }

  if (username) {
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      res.status(409).json({ success: false, message: "Username already taken" });
      return;
    }
  }

  const user = await User.create({
    email,
    passwordHash: password,
    name,
    username,
  
    locale,
    authProvider: "local",
  });

  res.status(201).json({ success: true, data: user.toPublicJSON() });
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!isValidObjectId(userId)) {
    res.status(400).json({ success: false, message: "Invalid user id in token" });
    return;
  }

  const user = await User.findOne({ _id: userId, deletedAt: { $exists: false } });

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.status(200).json({ success: true, data: user.toPublicJSON() });
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!isValidObjectId(userId)) {
    res.status(400).json({ success: false, message: "Invalid user id in token" });
    return;
  }

  const body = req.body as UpdateProfileInput;

  const updates: Record<string, unknown> = {};
  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (body[field as keyof UpdateProfileInput] !== undefined) {
      updates[field] = body[field as keyof UpdateProfileInput];
    }
  }

  if (body.password) {
    updates.passwordHash = await bcrypt.hash(body.password, 12);
  }

  if (updates.username) {
    const usernameTaken = await User.findOne({
      username: updates.username,
      _id: { $ne: userId },
    });
    if (usernameTaken) {
      res.status(409).json({ success: false, message: "Username already taken" });
      return;
    }
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, deletedAt: { $exists: false } },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.status(200).json({ success: true, data: user.toPublicJSON() });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!isValidObjectId(userId)) {
    res.status(400).json({ success: false, message: "Invalid user id in token" });
    return;
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, deletedAt: { $exists: false } },
    {
      $set: { deletedAt: new Date(), isActive: false },
      $inc: { refreshTokenVersion: 1 },
    },
    { new: true }
  );

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.status(200).json({ success: true, message: "User deleted" });
});

export const userController = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
};
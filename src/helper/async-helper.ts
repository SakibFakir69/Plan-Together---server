import { Request, Response } from "express";

export const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (err) {
      console.error(`[UserController] ${req.method} ${req.originalUrl}:`, err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

import { Router } from "express";

import { requireAuth } from "../../middlewares";
import { authController } from "./auth.controller";
import { authRateLimit } from "../../middlewares/rate-limiter";
import rateLimit from "express-rate-limit";

const router = Router();



router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshAccessToken);

router.post("/forgot-password",
    authRateLimit, authController.forgotPassword);
router.post("/reset-password",rateLimit, authController.resetPassword);


router.post("/logout", requireAuth, authController.logoutUser);
router.post("/logout-all", requireAuth, authController.logoutAllDevices);
router.post("/change-password", requireAuth,rateLimit, authController.changePassword);

export const authRouter = router;
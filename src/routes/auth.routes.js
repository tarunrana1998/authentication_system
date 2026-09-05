import { Router } from "express";
import {
    register,
    login,
    refreshAccessToken,
    logout,
    getProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", logout);
router.get("/profile", protect, getProfile);

export default router;

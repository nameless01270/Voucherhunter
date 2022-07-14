import express from "express";
import { login, register, verifyEmail, forgotPassword, resetPassword1 } from "../controllers/auth.js";
import { isResetTokenValid } from "../config/functionSupport.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", isResetTokenValid, resetPassword1);

export default router;
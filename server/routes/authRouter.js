import express from 'express';
import { forgotPassword, getUser, googleAuth, googleAuthCallback, login, logout, register, resetPassword, updatePassword, verifyOTP } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleWare.js';


const router = express.Router();
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;
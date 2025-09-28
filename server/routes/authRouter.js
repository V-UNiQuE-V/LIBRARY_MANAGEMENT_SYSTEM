import express from 'express';
import { getUser, login, logout, register, verifyOTP } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleWare.js';
import { forgotPassword } from '../controllers/authController.js';

const router = express.Router();
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.get("/password/forgot", forgotPassword);

export default router;
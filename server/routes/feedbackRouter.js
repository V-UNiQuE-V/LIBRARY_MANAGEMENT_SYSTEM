import express from "express";
import {
    submitFeedback,
    getAllFeedback,
    getUserFeedback,
    deleteFeedback,
} from "../controllers/feedbackController.js";
import {
    isAuthenticated,
    isAuthorized,
} from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.post("/submit", isAuthenticated, submitFeedback);
router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllFeedback);
router.get("/my-feedback", isAuthenticated, getUserFeedback);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteFeedback);

export default router;

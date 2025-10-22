import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Feedback } from "../models/feedbackModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { validateFields } from "../utils/validateFields.js";

export const submitFeedback = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, category } = req.body;
    const user = req.user;
    
    const validateFieldsError = validateFields({ rating, comment });
    if (validateFieldsError) {
        return next(new ErrorHandler(validateFieldsError, 400));
    }
    
    if (rating < 1 || rating > 5) {
        return next(new ErrorHandler("Rating must be between 1 and 5", 400));
    }
    
    const feedback = await Feedback.create({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        rating,
        comment,
        category: category || "General",
    });
    
    res.status(201).json({
        success: true,
        message: "Feedback submitted successfully.",
        feedback,
    });
});

export const getAllFeedback = catchAsyncErrors(async (req, res, next) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
        success: true,
        feedbacks,
    });
});

export const getUserFeedback = catchAsyncErrors(async (req, res, next) => {
    const feedbacks = await Feedback.find({ "user.id": req.user._id })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({
        success: true,
        feedbacks,
    });
});

export const deleteFeedback = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
        return next(new ErrorHandler("Feedback not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Feedback deleted successfully.",
    });
});

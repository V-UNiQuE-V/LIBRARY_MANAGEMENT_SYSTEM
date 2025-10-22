import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ["General", "Book Quality", "Service", "Website", "Other"],
        default: "General",
    },
}, {
    timestamps: true,
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        requeired: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["Admin","User"],
        default: "User",
    },
    accountVerified: {type: Boolean,default: false},
    borrowedBooks: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Borrow",
            },
            returned: {
                type: Boolean,
                default: false,
            },
            bookTitle: String,
            borrowedDate: Date,
            dueDate: Date,
        },
    ],
    avatar: {
        public_id: String,
        url: String,
    },
    verificationCode: Number,
    verificationCodeExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    },
    {
        timestamps: true,
    }
);

userSchema.methods.generateVerificationCode = function() {
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1; // First digit should be between 1-9
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, 0); // Remaining four digits can be between 0-9
        return parseInt(firstDigit + remainingDigits);
    }
    const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    return verificationCode;
};

userSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
}

export const User = mongoose.model("User", userSchema);
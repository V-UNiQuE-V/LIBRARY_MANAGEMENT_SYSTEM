class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyvalue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    if(err.name === 'JsonWebTokenError') {
        const statusCode = 400;
        const message = 'Json Web Token is Invalid. Try again';
        err = new ErrorHandler(message, statusCode);
    }

    if(err.name === 'TokenExpiredError') {
        const statusCode = 400;
        const message = 'Json Web Token has Expired. Please Login Again';
        err = new ErrorHandler(message, statusCode);
    }

    if(err.name === "CastError") {
        const statusCode = 400;
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, statusCode);
    }

    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map(error => error.message)
            .join(" ")
        : err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;
export const sendToken = (user, statusCode, message, res, callback) => {
    const token = user.generateToken();
    res.status(statusCode).cookie("token", token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
        sameSlite: "None",
    });
    
    if (callback && typeof callback === 'function') {
        // For OAuth redirects
        callback();
    } else {
        // For regular JSON responses
        res.json({
            success: true,
            user,
            message,
            token,
        });
    }
};
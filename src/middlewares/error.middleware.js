import config from "../config/config.js";

// Not Found Handler (404)
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || "Internal Server Error",
        stack: config.nodeEnv === "development" ? err.stack : undefined,
    });
};

export const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data,
    });
};

export const sendError = (res, statusCode = 500, message = "Internal Server Error", errors = null) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(errors && { errors }),
    });
};

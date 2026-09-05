import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendError } from "../utils/apiResponse.js";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check Authorization Header (supports raw token or "Bearer <token>")
        if (req.headers.authorization) {
            token = req.headers.authorization.replace(/^Bearer\s+/i, "").trim();
        }
        // 2. Check custom headers (x-access-token or token)
        else if (req.headers["x-access-token"]) {
            token = req.headers["x-access-token"];
        } else if (req.headers["token"]) {
            token = req.headers["token"];
        }

        if (!token) {
            return sendError(res, 401, "Not authorized, access token is missing");
        }

        // Verify token with Access Token secret
        const decoded = jwt.verify(token, config.accessTokenSecret);

        // Fetch user from decoded id (excluding password & refreshToken)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return sendError(res, 401, "User belonging to this token no longer exists");
        }

        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return sendError(res, 401, "Invalid access token");
        }
        if (error.name === "TokenExpiredError") {
            return sendError(res, 401, "Access token has expired, please refresh your token");
        }
        next(error);
    }
};

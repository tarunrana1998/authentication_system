import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendError } from "../utils/apiResponse.js";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return sendError(res, 401, "Not authorized, no token provided");
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log(decoded);
        // Fetch user from decoded id (excluding password)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return sendError(res, 401, "User belonging to this token no longer exists");
        }

        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return sendError(res, 401, "Invalid token");
        }
        if (error.name === "TokenExpiredError") {
            return sendError(res, 401, "Token has expired, please log in again");
        }
        next(error);
    }
};

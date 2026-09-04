import { sendSuccess, sendError } from "../utils/apiResponse.js";
import User from "../models/user.model.js";

// @desc    Register a new user
// @route   POST /api/v1/auth/register
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return sendError(res, 400, "Please provide all required fields (name, email, password)");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 409, "User with this email already exists");
        }

        const user = await User.create({ name, email, password });

        return sendSuccess(res, 201, "User registered successfully", {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 400, "Please provide email and password");
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || user.password !== password) {
            return sendError(res, 401, "Invalid email or password");
        }

        return sendSuccess(res, 200, "Login successful", {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/profile
export const getProfile = async (req, res, next) => {
    try {
        return sendSuccess(res, 200, "Profile fetched successfully", {
            message: "Authentication profile endpoint ready",
        });
    } catch (error) {
        next(error);
    }
};

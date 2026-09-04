import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import User from "../models/user.model.js";

// Helper function to sign JWT token
const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
};

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

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        return sendSuccess(res, 201, "User registered successfully", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
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

        // Find user & include password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return sendError(res, 401, "Invalid email or password");
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 401, "Invalid email or password");
        }

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        return sendSuccess(res, 200, "Login successful", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
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
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
};

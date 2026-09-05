import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import User from "../models/user.model.js";

// Helper: Hash token using SHA-256 before database storage
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

// Refresh Token Cookie configuration
const getRefreshTokenCookieOptions = () => ({
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// Helper: Generate Access Token (Short-lived, e.g. 15m)
export const generateAccessToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        config.accessTokenSecret,
        { expiresIn: config.accessTokenExpiresIn }
    );
};

// Helper: Generate Refresh Token (Long-lived, e.g. 7d)
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.refreshTokenSecret,
        { expiresIn: config.refreshTokenExpiresIn }
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

        // Generate raw tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Save hashed refresh token to user document
        user.refreshToken = hashToken(refreshToken);
        await user.save();

        // Set raw Refresh Token only in HTTP-Only Cookie
        res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

        return sendSuccess(res, 201, "User registered successfully", {
            accessToken,
            refreshToken,
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

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 401, "Invalid email or password");
        }

        // Generate raw tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Save hashed refresh token in database
        user.refreshToken = hashToken(refreshToken);
        await user.save();

        // Set raw Refresh Token in HTTP-Only Cookie
        res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

        return sendSuccess(res, 200, "Login successful", {
            accessToken,
            refreshToken,
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

// @desc    Refresh Access Token
// @route   POST /api/v1/auth/refresh-token
export const refreshAccessToken = async (req, res, next) => {
    try {
        // Extract raw refresh token from cookie, body, or custom header
        const incomingRefreshToken =
            req.cookies?.refreshToken ||
            req.body?.refreshToken ||
            req.headers["x-refresh-token"];

        if (!incomingRefreshToken) {
            return sendError(res, 401, "Refresh token is missing");
        }

        // Verify refresh token signature & expiry
        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, config.refreshTokenSecret);
        } catch (err) {
            return sendError(res, 403, "Invalid or expired refresh token");
        }

        // Find user and select hashed refreshToken
        const user = await User.findById(decoded.id).select("+refreshToken");
        const hashedIncomingToken = hashToken(incomingRefreshToken);

        // Verify hashed token against stored hash in DB
        if (!user || user.refreshToken !== hashedIncomingToken) {
            return sendError(res, 403, "Refresh token is invalid or has been revoked");
        }

        // Generate new tokens (token rotation)
        const newAccessToken = generateAccessToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken(user._id);

        // Store new hashed refresh token
        user.refreshToken = hashToken(newRefreshToken);
        await user.save();

        // Update refresh token cookie
        res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());

        return sendSuccess(res, 200, "Token refreshed successfully", {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user & invalidate tokens
// @route   POST /api/v1/auth/logout
export const logout = async (req, res, next) => {
    try {
        const incomingRefreshToken =
            req.cookies?.refreshToken ||
            req.body?.refreshToken ||
            req.headers["x-refresh-token"];

        const userId = req.user?._id;

        if (userId) {
            await User.findByIdAndUpdate(userId, { refreshToken: null });
        } else if (incomingRefreshToken) {
            const hashedToken = hashToken(incomingRefreshToken);
            await User.findOneAndUpdate(
                { refreshToken: hashedToken },
                { refreshToken: null }
            );
        }

        // Clear HTTP-Only refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: config.nodeEnv === "production",
            sameSite: "strict",
        });

        return sendSuccess(res, 200, "Logged out successfully");
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

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// CORS configuration
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://auth-red-seven.vercel.app",
        ],
        credentials: true,
    })
);

// Core Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health / Root Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        statusCode: 200,
        message: "Authentication System API is running",
        data: {
            version: "1.0.0",
            docs: "/api/v1",
        },
    });
});

// API Routes
app.use("/api/v1", routes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

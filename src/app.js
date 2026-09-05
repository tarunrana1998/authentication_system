import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

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

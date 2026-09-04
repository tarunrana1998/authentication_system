import dotenv from "dotenv";

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
    mongoDatabase: process.env.MONGO_DATABASE,
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export default Object.freeze(config);
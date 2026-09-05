import dotenv from "dotenv";

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
    mongoDatabase: process.env.MONGO_DATABASE,
    nodeEnv: process.env.NODE_ENV || "development",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default_access_token_secret_key",
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret_key",
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
};

export default Object.freeze(config);
import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    try {
        if (!config.mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        if(!config.mongoDatabase){
            throw new Error("MONGO_DATABASE is not defined in environment variables");
        }

        const conn = await mongoose.connect(config.mongoURI, {
            dbName: config.mongoDatabase,
        });
        console.log(` MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
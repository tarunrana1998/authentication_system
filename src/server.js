import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./config/database.js";

const startServer = async () => {
    // Connect to Database
    await connectDB();

    // Start Express Server
    app.listen(config.port, () => {
        console.log(` Server is running in ${config.nodeEnv} mode on port ${config.port}`);
    });
};

startServer();

import app from "./app.js";
import { ENV } from "./config/env.js";

const startServer = () => {
    try {
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on http://localhost:${ENV.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

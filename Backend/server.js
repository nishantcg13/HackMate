import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware to read JSON data
app.use(express.json());

// User API routes
app.use("/api/users", userRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to HackMate Backend!");
});

const PORT = 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
    }
};

startServer();
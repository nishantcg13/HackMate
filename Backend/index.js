import express from "express";
import "dotenv/config";

import userRoutes from "./src/routes/userRoutes.js";
import hackathonRoutes from "./src/routes/hackathonRoutes.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import teamMemberRoutes from "./src/routes/teamMemberRoutes.js";
import joinRequestRoutes from "./src/routes/joinRequestRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

import dbConnection from "./src/config/dbConfig.js";

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use("/api/auth", authRoutes);

// Start server
const startServer = async () => {
  try {
    await dbConnection();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();

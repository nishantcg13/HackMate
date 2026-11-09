import express from "express";
import "dotenv/config";
import bcrypt from "bcryptjs";

import userRoutes from "./src/routes/userRoutes.js";
import hackathonRoutes from "./src/routes/hackathonRoutes.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import teamMemberRoutes from "./src/routes/teamMemberRoutes.js";
import joinRequestRoutes from "./src/routes/joinRequestRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";

import dbConnection from "./src/config/dbConfig.js";
import User from "./src/models/User.js";

const app = express();
const port = process.env.PORT || 3000;

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
app.use("/api/contact", contactRoutes);

// Auto-seed Admin accounts if database is freshly created/empty
const seedInitialData = async () => {
  try {
    const adminEmails = ["admin@hackmate.com", "admin@gmail.com"];
    for (const adminEmail of adminEmails) {
      const existing = await User.findOne({ email: adminEmail });
      if (!existing) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await User.create({
          name: "Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN",
          skills: ["Administration", "Management"],
          bio: "HackMate System Administrator",
        });
        console.log(`Database initialized: Admin account created (${adminEmail} / admin123)`);
      }
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

// Start server
const startServer = async () => {
  try {
    await dbConnection();
    await seedInitialData();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();

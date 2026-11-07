import { Router } from "express";
import {
  searchUsers,
  getUserProfile,
  updateUserProfile,
  getUserTeams,
  getUserDashboard
} from "../controller/userController.js";
import verifyToken from "../middleware/authMiddleware.js";

const userRoutes = Router();

// GET all users (or filter by ?name= & ?skill=) from MongoDB
userRoutes.get("/", searchUsers);

// GET user dashboard
userRoutes.get("/dashboard", verifyToken, getUserDashboard);

// GET user teams
userRoutes.get("/:userId/teams", getUserTeams);

// GET specific user profile
userRoutes.get("/:userId", getUserProfile);

// UPDATE user profile
userRoutes.put("/profile", verifyToken, updateUserProfile);

export default userRoutes;

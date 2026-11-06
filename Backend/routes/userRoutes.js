import express from "express";

import {
    getUserProfile,
    updateUserProfile,
    updateUserSkills,
    searchUsers,
    getUserTeams,
    getUserRequests,
    getUserDashboard,
    getLeaderDashboard,
    getRecentActivity,
    getDashboardStats
} from "../controllers/userController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// API 35 - Search Users
router.get("/search", searchUsers);

// API 38 - User Dashboard
router.get("/dashboard/user", verifyToken, getUserDashboard);

// API 39 - Leader Dashboard
router.get("/dashboard/leader", verifyToken, getLeaderDashboard);

// API 40 - Recent Activity
router.get("/dashboard/activity", verifyToken, getRecentActivity);

// API 41 - Dashboard Stats
router.get("/dashboard/stats", verifyToken, getDashboardStats);

// API 36 - Get User Teams
router.get("/:userId/teams", getUserTeams);

// API 37 - Get User Requests
router.get("/:userId/requests", getUserRequests);

// API 32 - Get User Profile
router.get("/:userId", getUserProfile);

// API 33 - Update User Profile
router.put("/profile", verifyToken, updateUserProfile);

// API 34 - Manage User Skills
router.patch("/profile/skills", verifyToken, updateUserSkills);

export default router;
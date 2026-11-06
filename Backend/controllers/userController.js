
import mongoose from "mongoose";

import User from "../models/User.js";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";
import JoinRequest from "../models/JoinRequest.js";
import Hackathon from "../models/Hackathon.js";


// API 32 - Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 33 - Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const allowedFields = ["name", "bio", "skills"];
        const updatedData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updatedData[field] = req.body[field];
            }
        }

        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide profile data"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updatedData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 34 - Manage User Skills
export const updateUserSkills = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { action, skills } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!["add", "remove"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be add or remove"
            });
        }

        if (
            !Array.isArray(skills) ||
            skills.length === 0 ||
            !skills.every(skill =>
                typeof skill === "string" && skill.trim().length > 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Skills must be a non-empty array"
            });
        }

        const update = action === "add"
            ? { $addToSet: { skills: { $each: skills } } }
            : { $pull: { skills: { $in: skills } } };

        const user = await User.findByIdAndUpdate(
            userId,
            update,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Skills updated successfully",
            data: user.skills
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 35 - Search Users
export const searchUsers = async (req, res) => {
    try {
        const { name, skill } = req.query;

        const filter = {};

        if (name) {
            filter.name = {
                $regex: name,
                $options: "i"
            };
        }

        if (skill) {
            filter.skills = {
                $regex: skill,
                $options: "i"
            };
        }

        const users = await User.find(filter).select("-password");

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 36 - Get User Teams
export const getUserTeams = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const teams = await TeamMember.find({ userId })
            .populate("teamId");

        res.status(200).json({
            success: true,
            message: "User teams fetched successfully",
            data: teams
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 37 - Get User Requests
export const getUserRequests = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const requests = await JoinRequest.find({ userId })
            .populate("teamId")
            .populate("userId", "name email");

        res.status(200).json({
            success: true,
            message: "User requests fetched successfully",
            data: requests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 38 - User Dashboard
export const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const totalTeams = await TeamMember.countDocuments({ userId });
        const totalRequests = await JoinRequest.countDocuments({ userId });

        res.status(200).json({
            success: true,
            message: "User dashboard fetched successfully",
            data: {
                user,
                totalTeams,
                totalRequests
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 39 - Leader Dashboard
export const getLeaderDashboard = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const teams = await Team.find({ leaderId: userId })
            .populate("hackathonId", "title")
            .populate("leaderId", "name email");

        res.status(200).json({
            success: true,
            message: "Leader dashboard fetched successfully",
            data: {
                totalTeams: teams.length,
                teams
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 40 - Recent Activity
export const getRecentActivity = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const requests = await JoinRequest.find({ userId })
            .populate("teamId", "name")
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            message: "Recent activity fetched successfully",
            data: requests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// API 41 - Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const totalUsers = await User.countDocuments();
        const totalTeams = await Team.countDocuments();
        const totalHackathons = await Hackathon.countDocuments();
        const totalRequests = await JoinRequest.countDocuments({
            userId
        });

        res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully",
            data: {
                totalUsers,
                totalTeams,
                totalHackathons,
                totalRequests
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

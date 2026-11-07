import mongoose from "mongoose";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";
import User from "../models/User.js";

// API #28: Get All Members of a Team
export const getTeamMembers = async (req, res) => {
  try {
    // Get team ID from URL
    const { id } = req.params;

    // Validate team ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID"
      });
    }

    // Check whether team exists
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Find all members of this team
    const members = await TeamMember.find({
      team: id
    })
      .populate("user", "name email skills experience")
      .sort({ joinedAt: 1 });

    // Send response
    return res.status(200).json({
      success: true,
      message: "Team members fetched successfully",
      team: {
        id: team._id,
        name: team.name,
        maxMembers: team.maxMembers
      },
      count: members.length,
      data: members
    });

  } catch (error) {
    console.error("Get Team Members Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// API #29: Remove a Team Member
export const removeTeamMember = async (req, res) => {
  try {
    // Get logged-in user's ID
    const loggedInUserId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Validate logged-in user
    if (
      !loggedInUserId ||
      !mongoose.isValidObjectId(loggedInUserId)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Get team ID and target user ID from URL
    const { id, userId } = req.params;

    // Validate team ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID"
      });
    }

    // Validate target user ID
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member user ID"
      });
    }

    // Find team
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Check whether logged-in user is the team leader
    if (team.leader.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the team leader can remove members"
      });
    }

    // Prevent leader from removing themselves
    if (team.leader.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Team leader cannot be removed"
      });
    }

    // Find target team member
    const member = await TeamMember.findOne({
      team: id,
      user: userId
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "This user is not a member of the team"
      });
    }

    // Remove member from team
    await TeamMember.deleteOne({
      _id: member._id
    });

    return res.status(200).json({
      success: true,
      message: "Team member removed successfully",
      data: {
        teamId: id,
        removedUserId: userId
      }
    });

  } catch (error) {
    console.error("Remove Team Member Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// API #30: Leave Team
export const leaveTeam = async (req, res) => {
  try {
    // Get logged-in user's ID
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Validate logged-in user
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Get team ID from URL
    const { id } = req.params;

    // Validate team ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID"
      });
    }

    // Find team
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Prevent team leader from leaving
    if (team.leader.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Team leader cannot leave without transferring leadership"
      });
    }

    // Find logged-in user's membership
    const member = await TeamMember.findOne({
      team: id,
      user: userId
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "You are not a member of this team"
      });
    }

    // Remove user from team
    await TeamMember.deleteOne({
      _id: member._id
    });

    return res.status(200).json({
      success: true,
      message: "You have successfully left the team",
      data: {
        teamId: id,
        userId: userId
      }
    });

  } catch (error) {
    console.error("Leave Team Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// API #31: Add Team Member Directly
export const addTeamMember = async (req, res) => {
  try {
    // Get logged-in user's ID
    const leaderId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Validate logged-in user
    if (!leaderId || !mongoose.isValidObjectId(leaderId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Get team ID from URL
    const { id } = req.params;

    // Get user ID from request body
    const { userId } = req.body;

    // Validate team ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID"
      });
    }

    // Validate member user ID
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required"
      });
    }

    // Find team
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Check team leader permission
    if (team.leader.toString() !== leaderId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the team leader can add members"
      });
    }

    // Check whether direct addition is enabled
    if (team.allowDirectAdd !== true) {
      return res.status(403).json({
        success: false,
        message: "Direct member addition is disabled for this team"
      });
    }

    // Check whether the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent adding the team leader again
    if (team.leader.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Team leader is already part of the team"
      });
    }

    // Check whether user is already a member
    const existingMember = await TeamMember.findOne({
      team: id,
      user: userId
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: "User is already a member of this team"
      });
    }

    // Count current members
    const memberCount = await TeamMember.countDocuments({
      team: id
    });

    // Check maximum team capacity
    if (memberCount >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Team has reached its maximum member limit"
      });
    }

    // Add user to team
    const newMember = await TeamMember.create({
      team: id,
      user: userId,
      role: "Member"
    });

    return res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data: newMember
    });

  } catch (error) {
    console.error("Add Team Member Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User is already a member of this team"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
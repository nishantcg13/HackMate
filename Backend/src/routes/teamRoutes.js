import { Router } from "express";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";
import User from "../models/User.js";
import verifyToken from "../middleware/authMiddleware.js";

const teamRoutes = Router();

// GET all teams from MongoDB
teamRoutes.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("leader", "name email")
      .populate("leaderId", "name email");

    // Fetch member count for each team
    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const memberCount = await TeamMember.countDocuments({
          $or: [{ team: team._id }, { teamId: team._id }],
        });

        return {
          id: team._id,
          _id: team._id,
          name: team.name,
          description: team.description,
          leader: team.leader?.name || team.leaderId?.name || "Team Leader",
          requiredSkills: team.requiredSkills || [],
          skills: team.requiredSkills?.length ? team.requiredSkills : ["General"],
          maxMembers: team.maxMembers || 5,
          currentMembers: Math.max(memberCount, 1),
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Teams fetched successfully",
      data: teamsWithMembers,
    });
  } catch (error) {
    console.error("Fetch teams error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST create a new team in MongoDB
teamRoutes.post("/", async (req, res) => {
  try {
    const { name, description, requiredSkills, maxMembers, leaderId } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Team name and description are required",
      });
    }

    // Determine leader user ID (from token or fallback to passed leaderId or first user in DB)
    let leader = req.user?.id || req.user?._id || leaderId;
    if (!leader) {
      const firstUser = await User.findOne();
      leader = firstUser?._id;
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : typeof requiredSkills === "string"
      ? requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newTeam = await Team.create({
      name,
      description,
      requiredSkills: skillsArray,
      maxMembers: parseInt(maxMembers) || 5,
      leader: leader,
      leaderId: leader,
      status: "OPEN",
    });

    // Also add leader into teamMembers collection
    if (leader) {
      await TeamMember.create({
        team: newTeam._id,
        teamId: newTeam._id,
        user: leader,
        userId: leader,
        role: "LEADER",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: newTeam,
    });
  } catch (error) {
    console.error("Create team error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET team by ID
teamRoutes.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("leader", "name email")
      .populate("leaderId", "name email");

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const members = await TeamMember.find({
      $or: [{ team: team._id }, { teamId: team._id }],
    }).populate("user", "name email skills").populate("userId", "name email skills");

    return res.status(200).json({
      success: true,
      data: {
        ...team.toObject(),
        members,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default teamRoutes;

import mongoose from "mongoose";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";
import User from "../models/User.js";
import JoinRequest from "../models/JoinRequest.js";
import Hackathon from "../models/Hackathon.js";

// ===============================================================
// API #5: POST /api/teams
// Create a new team for a hackathon. The creator becomes the leader.
// ===============================================================
export const createTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      teamName,
      description,
      hackathonId,
      hackathonName,
      requiredSkills,
      maxMembers,
      startDate,
      endDate,
      registrationDeadline,
      registrationEndDate,
    } = req.body;

    const finalRegDeadline = registrationDeadline || registrationEndDate;

    // Use name or teamName (supports both frontend conventions)
    const finalName = name || teamName;

    // 1. Validation: check required fields
    if (!finalName || !description || !maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Please provide team name, description, and maxMembers",
      });
    }

    // 2. Resolve hackathon from user-entered text or ID
    const hackathonInput = (hackathonName || req.body.hackathon || hackathonId || "").toString().trim();
    let finalHackathonId = null;

    if (hackathonInput && mongoose.Types.ObjectId.isValid(hackathonInput)) {
      finalHackathonId = hackathonInput;
    } else if (hackathonInput) {
      // Find existing hackathon by title (case-insensitive) or create a new one
      let hackathonDoc = await Hackathon.findOne({
        title: { $regex: new RegExp(`^${hackathonInput}$`, "i") },
      });
      if (!hackathonDoc) {
        hackathonDoc = await Hackathon.create({
          title: hackathonInput,
          description: `${hackathonInput} Event`,
          organizer: "HackMate",
          location: "Online",
          mode: "ONLINE",
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          registrationDeadline: finalRegDeadline ? new Date(finalRegDeadline) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: "UPCOMING",
          createdBy: userId,
        });
      }
      finalHackathonId = hackathonDoc._id;
    } else {
      // Fallback: If left empty, link to default hackathon
      let defaultHackathon = await Hackathon.findOne();
      if (!defaultHackathon) {
        defaultHackathon = await Hackathon.create({
          title: "Hackathon 2026",
          description: "Annual Tech Innovation Hackathon",
          organizer: "HackMate",
          location: "Online",
          mode: "ONLINE",
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          registrationDeadline: finalRegDeadline ? new Date(finalRegDeadline) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: "UPCOMING",
          createdBy: userId,
        });
      }
      finalHackathonId = defaultHackathon._id;
    }

    // 3. Create the team
    const team = await Team.create({
      name: finalName,
      description,
      hackathon: finalHackathonId,
      hackathonId: finalHackathonId,
      leader: userId,
      leaderId: userId,
      requiredSkills: requiredSkills || [],
      maxMembers: Number(maxMembers),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      registrationDeadline: finalRegDeadline ? new Date(finalRegDeadline) : undefined,
      status: "OPEN",
    });

    // 4. Add the creator as the LEADER in TeamMember collection
    await TeamMember.create({
      team: team._id,
      teamId: team._id,
      user: userId,
      userId: userId,
      role: "LEADER",
    });

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating team",
      error: error.message,
    });
  }
};

// ===============================================================
// API #6: GET /api/teams
// Retrieve teams with optional filters and pagination
// Query params: page, limit, hackathonId, status
// ===============================================================
export const getAllTeams = async (req, res) => {
  try {
    const { page = 1, limit = 10, hackathonId, status } = req.query;

    // 1. Build filter object
    const filter = {};
    if (hackathonId) {
      filter.$or = [{ hackathonId }, { hackathon: hackathonId }];
    }
    if (status) {
      filter.status = status;
    }

    // 2. Pagination calculation
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // 3. Fetch teams and total count
    const totalTeams = await Team.countDocuments(filter);
    const teams = await Team.find(filter)
      .populate("leader", "name email")
      .populate("hackathon", "title name")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalTeams,
      currentPage: pageNum,
      totalPages: Math.ceil(totalTeams / limitNum),
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching teams",
      error: error.message,
    });
  }
};

// ===============================================================
// API #7: GET /api/teams/:id
// Retrieve details of a particular team along with its members
// ===============================================================
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find team by ID
    const team = await Team.findById(id)
      .populate("leader", "name email")
      .populate("hackathon", "title name");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // 2. Find all members of this team
    const members = await TeamMember.find({
      $or: [{ team: id }, { teamId: id }],
    }).populate("user", "name email skills");

    return res.status(200).json({
      success: true,
      team,
      members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching team details",
      error: error.message,
    });
  }
};

// ===============================================================
// API #8: PUT /api/teams/:id
// Update team information after checking leader or admin permission
// ===============================================================
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1. Check if team exists
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // 2. Check permission: must be team leader OR an admin
    const currentUser = await User.findById(userId);
    const isLeader =
      (team.leader && team.leader.toString() === userId) ||
      (team.leaderId && team.leaderId.toString() === userId);
    const isAdmin = currentUser && currentUser.role === "ADMIN";

    if (!isLeader && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only team leader or admin can update team.",
      });
    }

    // 3. Update the fields provided in body
    const {
      name,
      teamName,
      description,
      requiredSkills,
      maxMembers,
      status,
      startDate,
      endDate,
      registrationDeadline,
      registrationEndDate,
    } = req.body;
    if (name || teamName) team.name = name || teamName;
    if (description) team.description = description;
    if (requiredSkills) team.requiredSkills = requiredSkills;
    if (maxMembers) team.maxMembers = Number(maxMembers);
    if (status) team.status = status;
    if (startDate !== undefined) team.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) team.endDate = endDate ? new Date(endDate) : null;
    const finalRegDeadline = registrationDeadline !== undefined ? registrationDeadline : registrationEndDate;
    if (finalRegDeadline !== undefined) team.registrationDeadline = finalRegDeadline ? new Date(finalRegDeadline) : null;

    await team.save();

    return res.status(200).json({
      success: true,
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating team",
      error: error.message,
    });
  }
};

// ===============================================================
// API #9: DELETE /api/teams/:id
// Delete a team after checking permissions and related records
// ===============================================================
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1. Check if team exists
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // 2. Check permission: must be team leader OR an admin
    const currentUser = await User.findById(userId);
    const isLeader =
      (team.leader && team.leader.toString() === userId) ||
      (team.leaderId && team.leaderId.toString() === userId);
    const isAdmin = currentUser && currentUser.role === "ADMIN";

    if (!isLeader && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only team leader or admin can delete team.",
      });
    }

    // 3. Clean up related records: team members & join requests
    await TeamMember.deleteMany({ $or: [{ team: id }, { teamId: id }] });
    await JoinRequest.deleteMany({ $or: [{ team: id }, { teamId: id }] });

    // 4. Delete the team itself
    await Team.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Team and related records deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting team",
      error: error.message,
    });
  }
};

// ===============================================================
// API #10: GET /api/teams/my-teams
// Retrieve teams created or joined by the authenticated user
// ===============================================================
export const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find all team IDs the user is a member of
    const memberships = await TeamMember.find({
      $or: [{ user: userId }, { userId: userId }],
    });
    const joinedTeamIds = memberships.map((m) => m.team || m.teamId);

    // 2. Find teams where user is either the leader OR in the memberships list
    const teams = await Team.find({
      $or: [
        { leader: userId },
        { leaderId: userId },
        { _id: { $in: joinedTeamIds } },
      ],
    })
      .populate("leader", "name email")
      .populate("hackathon", "title name");

    return res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching my teams",
      error: error.message,
    });
  }
};

// ===============================================================
// API #11: PATCH /api/teams/:id/leader
// Transfer team leadership to an eligible existing member
// ===============================================================
export const transferLeadership = async (req, res) => {
  try {
    const { id } = req.params;
    const { newLeaderId } = req.body;
    const currentUserId = req.user.id;

    if (!newLeaderId) {
      return res.status(400).json({
        success: false,
        message: "Please provide newLeaderId",
      });
    }

    // 1. Find team
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // 2. Check that current user is the leader
    const isCurrentLeader =
      (team.leader && team.leader.toString() === currentUserId) ||
      (team.leaderId && team.leaderId.toString() === currentUserId);

    if (!isCurrentLeader) {
      return res.status(403).json({
        success: false,
        message: "Only the current team leader can transfer leadership",
      });
    }

    // 3. Verify that newLeaderId is an existing member of this team
    const member = await TeamMember.findOne({
      $or: [{ team: id }, { teamId: id }],
      $or: [{ user: newLeaderId }, { userId: newLeaderId }],
    });

    if (!member) {
      return res.status(400).json({
        success: false,
        message: "The new leader must be an existing member of this team",
      });
    }

    // 4. Update old leader role to 'Member' in TeamMember collection
    await TeamMember.updateOne(
      {
        $or: [{ team: id }, { teamId: id }],
        $or: [{ user: currentUserId }, { userId: currentUserId }],
      },
      { role: "Member" }
    );

    // 5. Update new leader role to 'LEADER' in TeamMember collection
    await TeamMember.updateOne(
      {
        $or: [{ team: id }, { teamId: id }],
        $or: [{ user: newLeaderId }, { userId: newLeaderId }],
      },
      { role: "LEADER" }
    );

    // 6. Update team document
    team.leader = newLeaderId;
    team.leaderId = newLeaderId;
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Leadership transferred successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error transferring leadership",
      error: error.message,
    });
  }
};

// ===============================================================
// API #12: GET /api/teams/search
// Search teams by hackathon, skills, status, or search keyword
// ===============================================================
export const searchTeams = async (req, res) => {
  try {
    const { q, hackathonId, skills, status } = req.query;

    const query = {};

    // Filter by hackathon
    if (hackathonId) {
      query.$or = [{ hackathonId }, { hackathon: hackathonId }];
    }

    // Filter by team status (e.g., OPEN, CLOSED)
    if (status) {
      query.status = status;
    }

    // Filter by required skills (comma-separated or single)
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query.requiredSkills = {
        $in: skillsArray.map((s) => new RegExp(s, "i")),
      };
    }

    // Keyword search in team name or description
    if (q) {
      query.$and = [
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
        },
      ];
    }

    const teams = await Team.find(query)
      .populate("leader", "name email")
      .populate("hackathon", "title name");

    return res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error searching teams",
      error: error.message,
    });
  }
};

// ===============================================================
// API #13: GET /api/teams/recommended
// Recommend teams using skill overlap with logged-in user
// ===============================================================
export const getRecommendedTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get the authenticated user's profile and skills
    const user = await User.findById(userId);
    const userSkills = user?.skills || [];

    // 2. Find open teams
    let recommendedTeams = [];

    if (userSkills.length > 0) {
      // Find open teams whose requiredSkills overlap with user's skills
      recommendedTeams = await Team.find({
        status: "OPEN",
        requiredSkills: { $in: userSkills },
      })
        .populate("leader", "name email")
        .populate("hackathon", "title name");
    }

    // 3. Fallback: If no skill matches found, return recently opened teams
    if (recommendedTeams.length === 0) {
      recommendedTeams = await Team.find({ status: "OPEN" })
        .populate("leader", "name email")
        .populate("hackathon", "title name")
        .limit(10);
    }

    return res.status(200).json({
      success: true,
      userSkills,
      count: recommendedTeams.length,
      teams: recommendedTeams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error recommending teams",
      error: error.message,
    });
  }
};

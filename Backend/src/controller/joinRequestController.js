import mongoose from "mongoose";

import Team from "../models/Team.js";
import JoinRequest from "../models/JoinRequest.js";
import TeamMember from "../models/TeamMember.js";

// API #21: Send Join Request
export const sendJoinRequest = async (req, res) => {
  try {
    // Get logged-in user ID from JWT
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Get team ID and message from request body
    const { teamId, message } = req.body;

    // Check authentication payload
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Validate team ID
    if (!teamId || !mongoose.isValidObjectId(teamId)) {
      return res.status(400).json({
        success: false,
        message: "Valid team ID is required"
      });
    }

    // Validate message
    if (message && typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message must be a string"
      });
    }

    if (message && message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 500 characters"
      });
    }

    // Check whether team exists
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Check whether team accepts requests
    if (team.isOpen === false) {
      return res.status(400).json({
        success: false,
        message: "This team is not accepting new members"
      });
    }

    // Check whether requester is the team leader
    if (team.leader.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Team leader cannot send a join request to their own team"
      });
    }

    // Check whether user is already a member
    const existingMember = await TeamMember.findOne({
      team: teamId,
      user: userId
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this team"
      });
    }

    // Check whether a pending request already exists
    const existingRequest = await JoinRequest.findOne({
      team: teamId,
      requester: userId,
      status: "Pending"
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending request for this team"
      });
    }

    // Check team capacity
    const totalMembers = await TeamMember.countDocuments({
      team: teamId
    });

    if (totalMembers >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Team is already full"
      });
    }

    // Create join request
    const joinRequest = await JoinRequest.create({
      team: teamId,
      requester: userId,
      message: message?.trim() || ""
    });

    return res.status(201).json({
      success: true,
      message: "Join request sent successfully",
      data: joinRequest
    });

  } catch (error) {
    // Handle duplicate pending request index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending request for this team"
      });
    }

    console.error("Send Join Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// API #22: Get All Join Requests Sent by Logged-in User

export const getSentRequests = async (req, res) => {
  try {
    // Get logged-in user ID from JWT
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Validate user ID
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Find all requests sent by logged-in user
    const requests = await JoinRequest.find({
      requester: userId
    })
      .populate("team", "name description leader maxMembers isOpen")
      .sort({ createdAt: -1 });

    // Return response
    return res.status(200).json({
      success: true,
      message: "Sent join requests fetched successfully",
      count: requests.length,
      data: requests
    });

  } catch (error) {
    console.error("Get Sent Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// API #23: Get All Join Requests Received by Team Leader
export const getReceivedRequests = async (req, res) => {
  try {
    // Get logged-in user's ID
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Validate user ID
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Find all teams created/led by the logged-in user
    const teams = await Team.find({
      leader: userId
    }).select("_id");

    // Get team IDs
    const teamIds = teams.map((team) => team._id);

    // Find join requests received by these teams
    const requests = await JoinRequest.find({
      team: { $in: teamIds }
    })
      .populate("requester", "name email skills experience")
      .populate("team", "name description leader maxMembers isOpen")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Received join requests fetched successfully",
      count: requests.length,
      data: requests
    });

  } catch (error) {
    console.error("Get Received Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// API #24: Get Join Request Details
export const getRequestDetails = async (req, res) => {
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

    // Get request ID from URL
    const { id } = req.params;

    // Validate request ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid join request ID"
      });
    }

    // Find join request and populate related details
    const joinRequest = await JoinRequest.findById(id)
      .populate("requester", "name email skills experience")
      .populate("team", "name description leader maxMembers isOpen");

    // Check if request exists
    if (!joinRequest) {
      return res.status(404).json({
        success: false,
        message: "Join request not found"
      });
    }

    // Check whether logged-in user is the requester
    const isRequester =
      joinRequest.requester._id.toString() === userId.toString();

    // Check whether logged-in user is the team leader
    const isTeamLeader =
      joinRequest.team.leader.toString() === userId.toString();

    // Allow only requester or team leader
    if (!isRequester && !isTeamLeader) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this join request"
      });
    }

    // Send response
    return res.status(200).json({
      success: true,
      message: "Join request details fetched successfully",
      data: joinRequest
    });

  } catch (error) {
    console.error("Get Request Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// API #25: Accept Join Request
export const acceptJoinRequest = async (req, res) => {
  try {
    // Get logged-in user's ID
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Validate user ID
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Get join request ID from URL
    const { id } = req.params;

    // Validate request ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid join request ID"
      });
    }

    // Find join request
    const joinRequest = await JoinRequest.findById(id);

    if (!joinRequest) {
      return res.status(404).json({
        success: false,
        message: "Join request not found"
      });
    }

    // Find the team
    const team = await Team.findById(joinRequest.team);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Check whether logged-in user is the team leader
    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the team leader can accept join requests"
      });
    }

    // Check request status
    if (joinRequest.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a ${joinRequest.status} request`
      });
    }

    // Check whether requester is already a team member
    const existingMember = await TeamMember.findOne({
      team: team._id,
      user: joinRequest.requester
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: "User is already a member of this team"
      });
    }

    // Count current team members
    const memberCount = await TeamMember.countDocuments({
      team: team._id
    });

    // Check team capacity
    if (memberCount >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Team has reached its maximum member limit"
      });
    }

    // Add requester to TeamMember collection
    await TeamMember.create({
      team: team._id,
      user: joinRequest.requester,
      role: "Member"
    });

    // Update join request status
    joinRequest.status = "Accepted";
    await joinRequest.save();

    return res.status(200).json({
      success: true,
      message: "Join request accepted successfully",
      data: {
        request: joinRequest,
        teamMember: {
          team: team._id,
          user: joinRequest.requester,
          role: "Member"
        }
      }
    });

  } catch (error) {
    console.error("Accept Join Request Error:", error);

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


// API #26: Reject Join Request
export const rejectJoinRequest = async (req, res) => {
  try {
    // Get logged-in user's ID
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Validate user ID
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Get join request ID from URL
    const { id } = req.params;

    // Validate request ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid join request ID"
      });
    }

    // Find join request
    const joinRequest = await JoinRequest.findById(id);

    if (!joinRequest) {
      return res.status(404).json({
        success: false,
        message: "Join request not found"
      });
    }

    // Find the team
    const team = await Team.findById(joinRequest.team);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // Check whether logged-in user is the team leader
    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the team leader can reject join requests"
      });
    }

    // Check request status
    if (joinRequest.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a ${joinRequest.status} request`
      });
    }

    // Update request status
    joinRequest.status = "Rejected";
    await joinRequest.save();

    return res.status(200).json({
      success: true,
      message: "Join request rejected successfully",
      data: joinRequest
    });

  } catch (error) {
    console.error("Reject Join Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// API #27: Cancel Join Request
export const cancelJoinRequest = async (req, res) => {
  try {
    // Get logged-in user's ID
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    // Validate user ID
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication"
      });
    }

    // Get request ID from URL
    const { id } = req.params;

    // Validate request ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid join request ID"
      });
    }

    // Find join request
    const joinRequest = await JoinRequest.findById(id);

    if (!joinRequest) {
      return res.status(404).json({
        success: false,
        message: "Join request not found"
      });
    }

    // Check whether logged-in user is the requester
    if (joinRequest.requester.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own join request"
      });
    }

    // Check request status
    if (joinRequest.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${joinRequest.status} request`
      });
    }

    // Update request status
    joinRequest.status = "Cancelled";
    await joinRequest.save();

    return res.status(200).json({
      success: true,
      message: "Join request cancelled successfully",
      data: joinRequest
    });

  } catch (error) {
    console.error("Cancel Join Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
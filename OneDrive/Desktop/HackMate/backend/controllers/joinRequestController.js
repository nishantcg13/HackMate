const mongoose = require("mongoose");

const JoinRequest = require("../models/JoinRequest");
const Team = require("../models/Team");
const TeamMember = require("../models/TeamMember");


exports.sendJoinRequest = async (req, res) => {

    try {

        // 1. Get team ID from request body
        const { teamId } = req.body;

        // 2. Get authenticated user ID
        const userId = req.user.id;

        // 3. Validate team ID
        if (!teamId) {

            return res.status(400).json({
                success: false,
                message: "Team ID is required"
            });

        }

        if (!mongoose.Types.ObjectId.isValid(teamId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Team ID"
            });

        }

        // 4. Check whether team exists
        const team = await Team.findById(teamId);

        if (!team) {

            return res.status(404).json({
                success: false,
                message: "Team not found"
            });

        }

        // 5. Check whether team is open
        if (team.status !== "OPEN") {

            return res.status(400).json({
                success: false,
                message: "This team is not accepting requests"
            });

        }

        // 6. Check current team capacity
        const memberCount = await TeamMember.countDocuments({
            teamId: teamId
        });

        if (memberCount >= team.maxMembers) {

            return res.status(400).json({
                success: false,
                message: "Team is already full"
            });

        }

        // 7. Check whether user is already a member
        const existingMember = await TeamMember.findOne({

            teamId: teamId,
            userId: userId

        });

        if (existingMember) {

            return res.status(409).json({
                success: false,
                message: "You are already a member of this team"
            });

        }

        // 8. Check duplicate pending request
        const existingRequest = await JoinRequest.findOne({

            teamId: teamId,
            userId: userId,
            status: "PENDING"

        });

        if (existingRequest) {

            return res.status(409).json({
                success: false,
                message: "You have already sent a join request"
            });

        }

        // 9. Create new join request
        const newRequest = await JoinRequest.create({

            teamId: teamId,
            userId: userId,
            status: "PENDING"

        });

        // 10. Send success response
        return res.status(201).json({

            success: true,

            message: "Join request sent successfully",

            data: newRequest

        });

    }

    catch (error) {

        // Handle duplicate request race condition
        if (error.code === 11000) {

            return res.status(409).json({
                success: false,
                message: "You already have a pending request for this team"
            });

        }

        console.error("Send Join Request Error:", error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
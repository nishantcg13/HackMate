//import { Router } from "express";

//const teamMemberRoutes = Router();

//export default teamMemberRoutes;

//--------------------------------------------------------------

//API-28 to 31

import express from "express";

import {
  getTeamMembers,
  removeTeamMember,
  leaveTeam,
  addTeamMember
} from "../controller/teamMemberController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// API #28: Get Team Members
router.get("/:id/members", verifyToken, getTeamMembers);

// API #29: Remove Team Member
router.delete("/:id/members/:userId", verifyToken, removeTeamMember);

// API #30: Leave Team
router.delete("/:id/leave", verifyToken, leaveTeam);

// API #31: Add Team Member
router.post("/:id/members", verifyToken, addTeamMember);

export default router;

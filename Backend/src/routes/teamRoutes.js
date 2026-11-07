import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  getMyTeams,
  transferLeadership,
  searchTeams,
  getRecommendedTeams,
} from "../controller/teamController.js";

const router = express.Router();

// ===============================================================
// Note: Specific routes (/my-teams, /search, /recommended) must come
// BEFORE parameterized routes (/:id) to prevent Express from treating
// words like "my-teams" as an ID parameter!
// ===============================================================

// API #10: Retrieve teams created or joined by authenticated user
router.get("/my-teams", verifyToken, getMyTeams);

// API #12: Search teams by hackathon, skills, status or keywords
router.get("/search", searchTeams);

// API #13: Recommend teams using skill overlap
router.get("/recommended", verifyToken, getRecommendedTeams);

// API #5: Create a team for a hackathon (creator becomes leader)
router.post("/", verifyToken, createTeam);

// API #6: Retrieve teams, with optional filters and pagination
router.get("/", getAllTeams);

// API #7: Retrieve details of a particular team
router.get("/:id", getTeamById);

// API #8: Update team information (checks leader/admin permission)
router.put("/:id", verifyToken, updateTeam);

// API #9: Delete a team (checks permission & cleans up related records)
router.delete("/:id", verifyToken, deleteTeam);

// API #11: Transfer team leadership to an eligible existing member
router.patch("/:id/leader", verifyToken, transferLeadership);

export default router;


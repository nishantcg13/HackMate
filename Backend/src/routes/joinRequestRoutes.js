//import { Router } from "express";

//const joinRequestRoutes = Router();

//export default joinRequestRoutes;



//API-21 to 27
import express from "express";

import {
  sendJoinRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestDetails,
  acceptJoinRequest,
  rejectJoinRequest,
  cancelJoinRequest
} from "../controller/joinRequestController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// API #21
router.post("/", verifyToken, sendJoinRequest);

// API #22
router.get("/sent", verifyToken, getSentRequests);

// API #23
router.get("/received", verifyToken, getReceivedRequests);

// API #24
router.get("/:id", verifyToken, getRequestDetails);

// API #25
router.patch("/:id/accept", verifyToken, acceptJoinRequest);

// API #26
router.patch("/:id/reject", verifyToken, rejectJoinRequest);

// API #27
router.delete("/:id", verifyToken, cancelJoinRequest);

export default router;

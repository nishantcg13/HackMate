const express = require("express");

const router = express.Router();

const {
    sendJoinRequest
} = require("../controllers/joinRequestController");

const authMiddleware = require("../middleware/authMiddleware");


// API 21 - Send Join Request

router.post(
    "/",
    authMiddleware,
    sendJoinRequest
);


module.exports = router;
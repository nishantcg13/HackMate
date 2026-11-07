import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "joinRequests" }
);

// Explicitly bind to the existing camelCase "joinRequests" collection
const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema, "joinRequests");

export default JoinRequest;

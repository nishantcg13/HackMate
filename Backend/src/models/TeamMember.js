import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    role: {
      type: String,
      default: "Member",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "teammembers" }
);

// Explicitly bind to standard lowercase "teammembers" collection
const TeamMember = mongoose.model("TeamMember", teamMemberSchema, "teammembers");

export default TeamMember;

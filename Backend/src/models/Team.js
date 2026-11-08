import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
    },

    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    maxMembers: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      default: "OPEN",
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    registrationDeadline: {
      type: Date,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "teams" }
);

// Explicitly bind to the "teams" collection
const Team = mongoose.model("Team", teamSchema, "teams");

export default Team;

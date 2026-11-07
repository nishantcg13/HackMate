import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    organizer: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "HYBRID"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED"],
      default: "UPCOMING",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "hackathons" }
);

// Explicitly bind to the "hackathons" collection
const Hackathon = mongoose.model("Hackathon", hackathonSchema, "hackathons");

export default Hackathon;

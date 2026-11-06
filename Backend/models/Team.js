
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hackathon",
        required: true
    },
    leaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    maxMembers: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ["OPEN"],
        default: "OPEN"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Team = mongoose.model("Team", teamSchema);

export default Team;

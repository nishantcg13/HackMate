
import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

joinRequestSchema.index(
    { teamId: 1, userId: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "PENDING" }
    }
);

const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);

export default JoinRequest;

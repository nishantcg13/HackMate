const mongoose = require("mongoose");

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

    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
        default: "PENDING"
    }

}, {
    timestamps: true
});

// Prevent duplicate pending requests
joinRequestSchema.index(
    { teamId: 1, userId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: "PENDING"
        }
    }
);

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
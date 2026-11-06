const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({

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

    role: {
        type: String,
        enum: ["LEADER", "MEMBER"],
        default: "MEMBER"
    }

}, {
    timestamps: true
});

teamMemberSchema.index(
    { teamId: 1, userId: 1 },
    { unique: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
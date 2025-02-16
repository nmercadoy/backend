import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["project_created", "project_updated", "analysis_run", "data_imported"],
        required: true,
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
    projectName: { type: String, required: false },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "editor", "admin"], default: "user" },
    organization: { type: String, default: null },
    profileData: {
        position: { type: String, default: null },
        department: { type: String, default: null },
        phone: { type: String, default: null },
        country: { type: String, default: null },
    },
    preferences: {
        language: { type: String, default: "es" },
        theme: { type: String, enum: ["light", "dark"], default: "light" },
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: false },
        },
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
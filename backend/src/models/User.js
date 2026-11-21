import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
    college: { type: String, trim: true, maxlength: 100, default: "" },
    passwordHash: { type: String, required: true, select: false },
    // Tokens issued before this moment are rejected, so a password change logs out other devices.
    passwordChangedAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
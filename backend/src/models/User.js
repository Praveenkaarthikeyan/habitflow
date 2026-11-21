import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true, // creates a unique index: the database itself blocks duplicates
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    // select:false means queries never return the hash unless asked explicitly.
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
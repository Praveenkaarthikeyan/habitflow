import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    content: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

blogSchema.index({ createdAt: -1 }); // fast "newest first" listing

export const Blog = mongoose.model("Blog", blogSchema);
import mongoose from "mongoose";
import { BLOG_CATEGORIES } from "../utils/blogCategories.js";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    content: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
    category: { type: String, enum: BLOG_CATEGORIES, default: "General", index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });

export const Blog = mongoose.model("Blog", blogSchema);
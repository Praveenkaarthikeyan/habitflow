import AppError from "../utils/AppError.js";
import { BLOG_CATEGORIES } from "../utils/blogCategories.js";

export function validateBlog(req, res, next) {
  const { title, content, category } = req.body || {};
  const errors = [];

  const cleanTitle = typeof title === "string" ? title.trim() : "";
  if (cleanTitle.length < 3 || cleanTitle.length > 120) errors.push("title must be 3 to 120 characters.");

  const cleanContent = typeof content === "string" ? content.trim() : "";
  if (cleanContent.length < 10 || cleanContent.length > 5000) errors.push("content must be 10 to 5000 characters.");

  const cleanCategory = category === undefined || category === "" ? "General" : category;
  if (!BLOG_CATEGORIES.includes(cleanCategory)) {
    errors.push(`category must be one of: ${BLOG_CATEGORIES.join(", ")}.`);
  }

  if (errors.length) return next(new AppError(400, "Validation failed.", errors));
  req.body = { title: cleanTitle, content: cleanContent, category: cleanCategory };
  next();
}
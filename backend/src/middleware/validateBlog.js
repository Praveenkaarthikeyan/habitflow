import AppError from "../utils/AppError.js";

export function validateBlog(req, res, next) {
  const { title, content } = req.body || {};
  const errors = [];

  const cleanTitle = typeof title === "string" ? title.trim() : "";
  if (cleanTitle.length < 3 || cleanTitle.length > 120) errors.push("title must be 3 to 120 characters.");

  const cleanContent = typeof content === "string" ? content.trim() : "";
  if (cleanContent.length < 10 || cleanContent.length > 5000) errors.push("content must be 10 to 5000 characters.");

  if (errors.length) return next(new AppError(400, "Validation failed.", errors));
  req.body = { title: cleanTitle, content: cleanContent };
  next();
}
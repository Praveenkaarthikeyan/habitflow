import AppError from "../utils/AppError.js";

export const CATEGORIES = ["Health", "Education", "Fitness", "Personal Development", "Productivity", "Lifestyle"];
export const FREQUENCIES = ["Daily", "Weekly"];
export const STATUSES = ["active", "paused", "archived"];

// Checks the request body, then replaces it with a cleaned copy containing only allowed fields.
export function validateHabit(req, res, next) {
  const body = req.body || {};
  const errors = [];

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title.length < 3 || title.length > 80) errors.push("title must be 3 to 80 characters.");

  const description = body.description === undefined ? "" : body.description;
  if (typeof description !== "string" || description.length > 500) {
    errors.push("description must be text of at most 500 characters.");
  }

  const category = body.category === undefined ? "Health" : body.category;
  if (!CATEGORIES.includes(category)) errors.push(`category must be one of: ${CATEGORIES.join(", ")}.`);

  const frequency = body.frequency === undefined ? "Daily" : body.frequency;
  if (!FREQUENCIES.includes(frequency)) errors.push(`frequency must be one of: ${FREQUENCIES.join(", ")}.`);

  const status = body.status === undefined ? "active" : body.status;
  if (!STATUSES.includes(status)) errors.push(`status must be one of: ${STATUSES.join(", ")}.`);

  if (errors.length) return next(new AppError(400, "Validation failed.", errors));

  req.body = { title, description: typeof description === "string" ? description.trim() : "", category, frequency, status };
  next();
}
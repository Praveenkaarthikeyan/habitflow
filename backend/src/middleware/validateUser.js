import AppError from "../utils/AppError.js";

export function validateProfile(req, res, next) {
  const { name, college } = req.body || {};
  const errors = [];

  const cleanName = typeof name === "string" ? name.trim() : "";
  if (cleanName.length < 2 || cleanName.length > 60) errors.push("name must be 2 to 60 characters.");

  let cleanCollege = "";
  if (college !== undefined && college !== null) {
    if (typeof college !== "string" || college.trim().length > 100) errors.push("college must be text of at most 100 characters.");
    else cleanCollege = college.trim();
  }

  if (errors.length) return next(new AppError(400, "Validation failed.", errors));
  req.body = { name: cleanName, college: cleanCollege };
  next();
}

export function validatePasswordChange(req, res, next) {
  const { currentPassword, newPassword } = req.body || {};
  const errors = [];

  if (typeof currentPassword !== "string" || !currentPassword) errors.push("currentPassword is required.");
  if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 72) {
    errors.push("newPassword must be 8 to 72 characters.");
  } else if (newPassword === currentPassword) {
    errors.push("newPassword must be different from the current password.");
  }

  if (errors.length) return next(new AppError(400, "Validation failed.", errors));
  req.body = { currentPassword, newPassword };
  next();
}
import AppError from "../utils/AppError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = [];

  const cleanName = typeof name === "string" ? name.trim() : "";
  if (cleanName.length < 2 || cleanName.length > 60) errors.push("name must be 2 to 60 characters.");

  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 120) errors.push("email must be a valid email address.");

  // bcrypt only uses the first 72 bytes, so cap the length.
  if (typeof password !== "string" || password.length < 8 || password.length > 72) {
    errors.push("password must be 8 to 72 characters.");
  }

  if (errors.length) return next(new AppError(400, "Validation failed.", errors));
  req.body = { name: cleanName, email: cleanEmail, password };
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return next(new AppError(400, "Validation failed.", ["email and password are required."]));
  }
  req.body = { email: email.trim().toLowerCase(), password };
  next();
}
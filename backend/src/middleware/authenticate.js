import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { authService } from "../services/authService.js";
import AppError from "../utils/AppError.js";

// Protects a route. Expects the header:  Authorization: Bearer <token>
export default function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return next(new AppError(401, "Please log in to continue."));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = authService.getUser(payload.sub); // throws 401 if the user no longer exists
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err.name === "TokenExpiredError") return next(new AppError(401, "Your session has expired. Please log in again."));
    next(new AppError(401, "Invalid token. Please log in again."));
  }
}
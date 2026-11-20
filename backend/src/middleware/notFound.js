import AppError from "../utils/AppError.js";

// Runs when no route matched.
export default function notFound(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}
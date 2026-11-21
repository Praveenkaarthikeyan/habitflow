import rateLimit from "express-rate-limit";
import AppError from "../utils/AppError.js";

const tooMany = (req, res, next) => next(new AppError(429, "Too many attempts. Please try again in a few minutes."));

// Slows down password guessing. Successful logins don't count.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooMany,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooMany,
});
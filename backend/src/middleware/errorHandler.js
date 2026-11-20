import { env } from "../config/env.js";

// The ONE place every error ends up. Must have 4 parameters so Express treats it as an error handler.
export default function errorHandler(err, req, res, next) {
  // Malformed JSON in the request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Request body is not valid JSON." });
  }

  // Errors we threw on purpose
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Unexpected bug: log the real error, send a safe message
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
    ...(env.nodeEnv === "development" && { debug: err.message }),
  });
}
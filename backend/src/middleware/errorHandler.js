import { env } from "../config/env.js";

export default function errorHandler(err, req, res, next) {
  // Malformed JSON in the request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Request body is not valid JSON." });
  }

  // Mongoose: a field broke a schema rule
  if (err.name === "ValidationError" && err.errors) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose: a value could not be converted (for example a bad id)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: `Invalid value for ${err.path}.` });
  }

  // MongoDB: unique index violated
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "That value is already in use." });
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
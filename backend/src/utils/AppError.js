// An error we throw on purpose, carrying the HTTP status code to send back.
export default class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details; // optional list of specific problems
  }
}
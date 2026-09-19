/**
 * Global Express error handler.
 * Must be registered AFTER all routes in server.js:
 *   app.use(errorHandler);
 *
 * Catches:
 * - Errors thrown from asyncHandler-wrapped controllers
 * - MongoDB validation/cast errors
 * - JWT errors (ready for auth)
 * - Generic 500 errors
 */

import logger from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  // Log the full error server-side
  logger.error(`[ErrorHandler] ${req.method} ${req.path} — ${err.message}`, {
    stack: err.stack,
    body: req.body,
  });

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      error: `A record with this ${field} already exists.`,
    });
  }

  // MongoDB validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(" ") });
  }

  // MongoDB bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format." });
  }

  // JWT errors (for when you add auth middleware)
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token has expired. Please log in again." });
  }

  // Custom status codes thrown deliberately
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error.";

  return res.status(status).json({ error: message });
}
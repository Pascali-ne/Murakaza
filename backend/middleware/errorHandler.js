/* eslint-disable no-unused-vars */

// 404 handler — mounted after all routes.
function notFound(req, res, next) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
}

// Central error handler — mounted last. Never leaks stack traces
// in production, and normalizes CORS/validation errors.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.message && err.message.includes("not permitted by CORS")) {
    return res.status(403).json({ error: "Cross-origin request blocked." });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({ error: "Validation failed.", details: err.errors });
  }

  const status = err.status || 500;
  const payload = { error: err.publicMessage || "Something went wrong on our end." };

  if (process.env.NODE_ENV !== "production") {
    payload.debug = err.message;
  }

  res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };

const jwt = require("jsonwebtoken");

/**
 * Verifies the Bearer JWT on the request and attaches `req.user`
 * as { id, email, role }.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

/**
 * Role-based access control. Usage: requireRole("ADMIN")
 * Must run after requireAuth.
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions for this action." });
    }
    next();
  };
}

/**
 * Attaches req.user if a valid token is present, but does not
 * reject the request otherwise. Useful for endpoints like feedback
 * submission that accept both guests and authenticated users.
 */
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
  } catch (err) {
    // Ignore invalid token for optional auth — treat as guest.
  }
  next();
}

module.exports = { requireAuth, requireRole, optionalAuth };

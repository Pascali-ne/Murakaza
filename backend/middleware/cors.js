const cors = require("cors");

// Parse configured origins or default to permissive wildcard
const raw = process.env.FRONTEND_ORIGIN || "*";
const allowedOrigins = raw
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // 1. Allow server-to-server / curl / healthcheck requests with no Origin header
    if (!origin) return callback(null, true);

    // 2. Allow wildcard or empty
    if (allowedOrigins.includes("*") || allowedOrigins.length === 0) {
      return callback(null, true);
    }

    // 3. Automatically allow all Vercel preview & production deployments and localhost
    if (
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    // 4. Default to allowing the origin with reflected header for smooth API access
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

module.exports = cors(corsOptions);

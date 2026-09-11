const cors = require("cors");

// Support a comma-separated list so preview deployments
// (e.g. murakaza-git-*.vercel.app) can be whitelisted alongside prod.
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server / curl requests with no Origin header.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not permitted by CORS policy.`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

module.exports = cors(corsOptions);

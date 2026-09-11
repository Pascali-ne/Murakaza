const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { createClient } = require("redis");

let redisClient;
let store;

if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.connect().catch((err) => console.error("Redis connection error:", err));

  store = new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "murakaza:rl:",
  });
}

/**
 * Factory for route-specific limiters. Falls back to in-memory
 * storage (per-instance) if Redis isn't configured, so local dev
 * works without extra setup — production on Render should always
 * set REDIS_URL for limits that hold across instances.
 */
function makeLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store,
    message: { error: message || "Too many requests, please try again later." },
  });
}

// General API traffic.
const generalLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
});

// Tighter limit on auth endpoints to blunt credential stuffing.
const authLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please wait before trying again.",
});

// Feedback submission — generous enough for real users, tight enough to stop spam.
const feedbackLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "You've submitted feedback too many times this hour.",
});

module.exports = { generalLimiter, authLimiter, feedbackLimiter };

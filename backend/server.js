require("dotenv").config();

const express = require("express");
const helmet = require("helmet");

const corsMiddleware = require("./middleware/cors");
const { generalLimiter } = require("./middleware/rateLimit");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const cmsRoutes = require("./routes/cms");
const paymentsRoutes = require("./routes/payments");
const feedbackRoutes = require("./routes/feedback");
const catalogRoutes = require("./routes/catalog");
const uploadRoutes = require("./routes/upload");
const { stripeWebhook } = require("./controllers/paymentsController");

const app = express();

// Render sits behind a reverse proxy — trust it so req.ip / rate
// limiting and HTTPS-enforcement below see the real client IP/proto.
app.set("trust proxy", 1);

app.use(helmet());

// Enforce HTTPS in production (Render terminates TLS at the edge and
// sets x-forwarded-proto; redirect any stray HTTP request).
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  next();
});

app.use(corsMiddleware);
app.options("*", corsMiddleware);
app.use(generalLimiter);

// Stripe requires the RAW request body to verify webhook signatures,
// so this route is registered before the global JSON parser below.
app.post("/api/payments/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// 50mb limit to support uploads and webhook signature verification
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Murakaza API listening on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

module.exports = app;

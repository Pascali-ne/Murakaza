const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  createIntent,
  stripeWebhook,
  flutterwaveWebhook,
  momoWebhook,
  myPayments,
} = require("../controllers/paymentsController");

const router = express.Router();

// Authenticated checkout flow.
router.post("/intent", requireAuth, createIntent);
router.get("/me", requireAuth, myPayments);

// Webhooks — NOT behind requireAuth (providers can't hold a user JWT).
// Each handler verifies its own provider-specific signature instead.
// Note: /webhook/stripe is mounted with express.raw() in server.js,
// upstream of the global express.json() parser.
router.post("/webhook/stripe", stripeWebhook);
router.post("/webhook/flutterwave", flutterwaveWebhook);
router.post("/webhook/momo", momoWebhook);

module.exports = router;

const express = require("express");
const { requireAuth, requireRole, optionalAuth } = require("../middleware/auth");
const {
  createIntent,
  stripeWebhook,
  flutterwaveWebhook,
  momoWebhook,
  myPayments,
  createIremboPayInvoice,
  irembopayWebhook,
  getPaymentStatus,
  listAllPaymentsAdmin,
  simulateWebhook,
} = require("../controllers/paymentsController");

const router = express.Router();

// Checkout flow — supports both logged-in users and guest parents/students.
router.post("/intent", optionalAuth, createIntent);
router.post("/irembopay/invoice", optionalAuth, createIremboPayInvoice);
router.get("/status/:providerRef", optionalAuth, getPaymentStatus);
router.get("/me", requireAuth, myPayments);
router.get("/admin/all", requireAuth, requireRole("ADMIN"), listAllPaymentsAdmin);
router.post("/test/simulate-webhook", simulateWebhook);

// Webhooks — NOT behind requireAuth (providers can't hold a user JWT).
// Each handler verifies its own provider-specific signature instead.
// Note: /webhook/stripe is mounted with express.raw() in server.js,
// upstream of the global express.json() parser.
router.post("/webhook/stripe", stripeWebhook);
router.post("/webhook/flutterwave", flutterwaveWebhook);
router.post("/webhook/momo", momoWebhook);
router.post("/webhook/irembopay", irembopayWebhook);

module.exports = router;


const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
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
} = require("../controllers/paymentsController");

const router = express.Router();

// Authenticated checkout flow.
router.post("/intent", requireAuth, createIntent);
router.post("/irembopay/invoice", requireAuth, createIremboPayInvoice);
router.get("/status/:providerRef", requireAuth, getPaymentStatus);
router.get("/me", requireAuth, myPayments);
router.get("/admin/all", requireAuth, requireRole("ADMIN"), listAllPaymentsAdmin);

// Webhooks — NOT behind requireAuth (providers can't hold a user JWT).
// Each handler verifies its own provider-specific signature instead.
// Note: /webhook/stripe is mounted with express.raw() in server.js,
// upstream of the global express.json() parser.
router.post("/webhook/stripe", stripeWebhook);
router.post("/webhook/flutterwave", flutterwaveWebhook);
router.post("/webhook/momo", momoWebhook);
router.post("/webhook/irembopay", irembopayWebhook);

module.exports = router;


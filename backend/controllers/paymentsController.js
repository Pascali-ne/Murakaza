const crypto = require("crypto");
const Stripe = require("stripe");
const { z } = require("zod");
const prisma = require("../config/db");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

const createIntentSchema = z.object({
  amountCents: z.number().int().positive(),
  currency: z.string().default("RWF"),
  description: z.string().optional(),
  provider: z.enum(["STRIPE", "FLUTTERWAVE", "MOMO"]),
});

// POST /api/payments/intent — authenticated user starts a checkout.
// Creates a PENDING record; the provider webhook later flips it to
// SUCCEEDED/FAILED. This keeps a durable audit trail even if the
// client never returns from checkout.
async function createIntent(req, res, next) {
  try {
    const { amountCents, currency, description, provider } = createIntentSchema.parse(req.body);

    if (provider === "STRIPE") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: currency.toLowerCase(),
        description,
        metadata: { userId: req.user.id },
        automatic_payment_methods: { enabled: true },
      });

      const record = await prisma.payment.create({
        data: {
          userId: req.user.id,
          provider: "STRIPE",
          providerRef: paymentIntent.id,
          amountCents,
          currency,
          description,
          status: "PENDING",
        },
      });

      return res.status(201).json({
        payment: record,
        clientSecret: paymentIntent.client_secret,
      });
    }

    // Flutterwave / MoMo: the client redirects to a hosted checkout page
    // built with these params; we pre-register a PENDING row keyed on a
    // tx_ref we generate now, so the webhook can find it later.
    const txRef = `murakaza_${provider.toLowerCase()}_${crypto.randomUUID()}`;
    const record = await prisma.payment.create({
      data: {
        userId: req.user.id,
        provider,
        providerRef: txRef,
        amountCents,
        currency,
        description,
        status: "PENDING",
      },
    });

    res.status(201).json({ payment: record, txRef });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/webhook/stripe
// IMPORTANT: this route must receive the *raw* request body (see
// server.js) — signature verification fails against parsed JSON.
async function stripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;
      const status = event.type === "payment_intent.succeeded" ? "SUCCEEDED" : "FAILED";

      await prisma.payment.updateMany({
        where: { providerRef: intent.id },
        data: { status, webhookVerified: true },
      });
    }
    res.json({ received: true });
  } catch (err) {
    console.error("Error processing Stripe webhook:", err);
    res.status(500).json({ error: "Webhook processing failed." });
  }
}

// POST /api/payments/webhook/flutterwave
// Flutterwave signs webhooks with a static verif-hash header rather
// than HMAC, so we do a constant-time string compare.
async function flutterwaveWebhook(req, res) {
  const signature = req.headers["verif-hash"];
  const expected = process.env.FLUTTERWAVE_WEBHOOK_HASH;

  if (!signature || !expected || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).json({ error: "Invalid webhook signature." });
  }

  try {
    const { txRef, status } = normalizeFlutterwavePayload(req.body);

    await prisma.payment.updateMany({
      where: { providerRef: txRef },
      data: { status, webhookVerified: true },
    });

    res.json({ received: true });
  } catch (err) {
    console.error("Error processing Flutterwave webhook:", err);
    res.status(500).json({ error: "Webhook processing failed." });
  }
}

function normalizeFlutterwavePayload(body) {
  const data = body.data || {};
  const txRef = data.tx_ref;
  const status = data.status === "successful" ? "SUCCEEDED" : "FAILED";
  return { txRef, status };
}

// POST /api/payments/webhook/momo
// MTN MoMo Collections uses a reference-id callback; verify against
// your subscription key setup per the MoMo API docs before trusting it.
async function momoWebhook(req, res) {
  try {
    const { referenceId, status } = req.body;
    const normalizedStatus = status === "SUCCESSFUL" ? "SUCCEEDED" : "FAILED";

    await prisma.payment.updateMany({
      where: { providerRef: referenceId },
      data: { status: normalizedStatus, webhookVerified: true },
    });

    res.json({ received: true });
  } catch (err) {
    console.error("Error processing MoMo webhook:", err);
    res.status(500).json({ error: "Webhook processing failed." });
  }
}

// GET /api/payments/me — authenticated user's own payment history.
async function myPayments(req, res, next) {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ payments });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createIntent,
  stripeWebhook,
  flutterwaveWebhook,
  momoWebhook,
  myPayments,
};

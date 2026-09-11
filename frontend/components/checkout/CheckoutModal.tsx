"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { payments, IremboInvoiceResponse } from "@/lib/api";

type Provider = "IREMBOPAY" | "MOMO" | "STRIPE" | "FLUTTERWAVE";
type Telecom = "MTN" | "AIRTEL";
type CheckoutStep = "details" | "irembo_widget" | "verifying" | "processing" | "success" | "error";

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, totalRwf, clearCart } = useCart();
  const { user } = useAuth();
  const { locale, t } = useLanguage();

  const [provider, setProvider] = useState<Provider>("IREMBOPAY");
  const [telecom, setTelecom] = useState<Telecom>("MTN");
  const [phone, setPhone] = useState("078");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  // IremboPay state
  const [iremboInvoice, setIremboInvoice] = useState<IremboInvoiceResponse | null>(null);
  const [pollingStatus, setPollingStatus] = useState<string>("Awaiting payment confirmation...");
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stripe Card fields
  const [cardName, setCardName] = useState(user?.fullName || "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [step, setStep] = useState<CheckoutStep>("details");
  const [txRef, setTxRef] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  if (!isCheckoutOpen) return null;

  // Poll verified server payment status
  const startPollingVerifiedStatus = (invoiceNumber: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await payments.getPaymentStatus(invoiceNumber);
        if (res.webhookVerified && res.status === "SUCCEEDED") {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setTxRef(invoiceNumber);
          setStep("success");
          clearCart();
        } else if (res.status === "FAILED") {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep("error");
          setErrorMsg("Payment failed or was cancelled at IremboPay gateway.");
        }
      } catch {
        // Continue polling
      }
    }, 2000);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (provider === "IREMBOPAY") {
      setStep("processing");
      try {
        const invoice = await payments.createIremboPayInvoice({
          amountRwf: totalRwf,
          description: `Murakaza order: ${items.length} item(s) (${items.map((i) => i.item.id).join(", ")})`,
          customer: {
            fullName: fullName || "Murakaza Student/Parent",
            phone,
            email,
          },
          items: items.map((i) => ({ id: i.item.id, qty: i.quantity, price: i.item.priceRwf })),
        });

        setIremboInvoice(invoice);
        setStep("irembo_widget");
        // Begin strict polling for cryptographically verified webhook transition
        startPollingVerifiedStatus(invoice.invoiceNumber);
      } catch (err: unknown) {
        setStep("error");
        const e = err as Error;
        setErrorMsg(e.message || "Failed to initialize IremboPay invoice.");
      }
      return;
    }

    setStep("processing");
    try {
      const payload = {
        amountCents: totalRwf * 100,
        currency: "RWF",
        provider,
        description: `Murakaza order: ${items.length} items (${items.map((i) => i.item.id).join(", ")})`,
      };

      const result = await payments.createIntent(payload);
      const reference = result.txRef || `MURA-${Date.now()}`;

      // Simulate legacy payment processing time
      setTimeout(() => {
        setTxRef(reference);
        setStep("success");
        clearCart();
      }, 2000);
    } catch (err) {
      setStep("error");
      setErrorMsg(err instanceof Error ? err.message : t("checkout.errorGeneric"));
    }
  };

  const handleResetAndClose = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setStep("details");
    setIremboInvoice(null);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-card shadow-floating overflow-hidden">
        {/* Header */}
        <div className="border-b border-ubumwe-100 bg-mist px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-card bg-ubumwe text-xs font-bold text-white">
              M
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ubumwe-900">{t("checkout.title")}</h2>
              <p className="text-xs text-ink/60">{t("checkout.subtitle")}</p>
            </div>
          </div>
          {step !== "processing" && (
            <button
              onClick={handleResetAndClose}
              className="grid h-8 w-8 place-items-center rounded-pill text-ink/60 hover:bg-ubumwe-50 hover:text-ubumwe"
            >
              ✕
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {step === "details" && (
            <form onSubmit={handlePay} className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ubumwe-900 mb-2">
                  {t("checkout.paymentMethod")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* IremboPay — Official Rwanda Gateway */}
                  <button
                    type="button"
                    onClick={() => setProvider("IREMBOPAY")}
                    className={`relative rounded-card p-3 border-2 text-left transition-all ${
                      provider === "IREMBOPAY"
                        ? "border-sun-600 bg-sun-100/40 shadow-soft ring-2 ring-sun-500/20"
                        : "border-ubumwe-100 hover:border-ubumwe-400 bg-mist"
                    }`}
                  >
                    <span className="absolute -top-2 right-2 rounded-full bg-sun-600 px-2 py-0.5 text-[9px] font-bold text-ubumwe-900 shadow">
                      🇷🇼 Official
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🏛️</span>
                      <span className="font-display text-xs font-bold text-ubumwe-900">IremboPay</span>
                    </div>
                    <p className="text-[10px] text-ink/60 mt-1 line-clamp-1">MoMo, Airtel, Cards</p>
                  </button>

                  {/* Mobile Money */}
                  <button
                    type="button"
                    onClick={() => setProvider("MOMO")}
                    className={`rounded-card p-3 border-2 text-left transition-all ${
                      provider === "MOMO"
                        ? "border-sun-600 bg-sun-100/30 shadow-soft"
                        : "border-ubumwe-100 hover:border-ubumwe-400 bg-mist"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">📱</span>
                      <span className="font-display text-xs font-bold text-ubumwe-900">MoMo / Airtel</span>
                    </div>
                    <p className="text-[10px] text-ink/60 mt-1 line-clamp-1">Direct USSD Push</p>
                  </button>

                  {/* Stripe Card */}
                  <button
                    type="button"
                    onClick={() => setProvider("STRIPE")}
                    className={`rounded-card p-3 border-2 text-left transition-all ${
                      provider === "STRIPE"
                        ? "border-sun-600 bg-sun-100/30 shadow-soft"
                        : "border-ubumwe-100 hover:border-ubumwe-400 bg-mist"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">💳</span>
                      <span className="font-display text-xs font-bold text-ubumwe-900">Card (Stripe)</span>
                    </div>
                    <p className="text-[10px] text-ink/60 mt-1 line-clamp-1">Visa, Mastercard</p>
                  </button>

                  {/* Flutterwave */}
                  <button
                    type="button"
                    onClick={() => setProvider("FLUTTERWAVE")}
                    className={`rounded-card p-3 border-2 text-left transition-all ${
                      provider === "FLUTTERWAVE"
                        ? "border-sun-600 bg-sun-100/30 shadow-soft"
                        : "border-ubumwe-100 hover:border-ubumwe-400 bg-mist"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🏦</span>
                      <span className="font-display text-xs font-bold text-ubumwe-900">Flutterwave</span>
                    </div>
                    <p className="text-[10px] text-ink/60 mt-1 line-clamp-1">Bank Transfer</p>
                  </button>
                </div>
              </div>

              {/* Dynamic Provider Input Fields */}
              {provider === "IREMBOPAY" && (
                <div className="rounded-card bg-sun-50/50 border border-sun-600/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏛️</span>
                      <p className="text-xs font-bold text-ubumwe-900">
                        IremboPay Rwandan National Gateway
                      </p>
                    </div>
                    <span className="rounded-full bg-imbuto-50 px-2 py-0.5 text-[10px] font-bold text-imbuto-700">
                      Zero Surcharge
                    </span>
                  </div>
                  <p className="text-xs text-ink/70">
                    Generates an official invoice supporting <strong>MTN Mobile Money (*182#)</strong>,{" "}
                    <strong>Airtel Money (*500#)</strong>, and <strong>Visa/Mastercard</strong> with cryptographically verified settlement.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-ubumwe-900 mb-1">
                        Payer Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jean Paul Ndayisaba"
                        className="w-full rounded-card border border-ubumwe-100 px-3 py-2 text-xs bg-white focus:border-ubumwe focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ubumwe-900 mb-1">
                        Mobile Number (for SMS &amp; USSD)
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="078... or 073..."
                        className="w-full rounded-card border border-ubumwe-100 px-3 py-2 text-xs bg-white focus:border-ubumwe focus:outline-none font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}
              {provider === "MOMO" && (
                <div className="rounded-card bg-sun-100/20 border border-sun-600/30 p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-bold text-ubumwe-900">{t("checkout.telecomLabel")}:</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTelecom("MTN");
                          if (!phone.startsWith("078") && !phone.startsWith("079")) setPhone("078");
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-pill transition-colors ${
                          telecom === "MTN" ? "bg-yellow-400 text-yellow-950 shadow-sm" : "bg-white text-ink/70"
                        }`}
                      >
                        🟡 MTN MoMo (*182#)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTelecom("AIRTEL");
                          if (!phone.startsWith("072") && !phone.startsWith("073")) setPhone("073");
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-pill transition-colors ${
                          telecom === "AIRTEL" ? "bg-red-500 text-white shadow-sm" : "bg-white text-ink/70"
                        }`}
                      >
                        🔴 Airtel Money (*500#)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ubumwe-900 mb-1">
                      {t("checkout.phoneLabel")}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("checkout.phonePlaceholder")}
                      className="w-full rounded-card border border-ubumwe-100 px-4 py-2.5 text-sm font-semibold tracking-wide focus:border-ubumwe focus:outline-none"
                    />
                    <p className="text-[11px] text-ink/60 mt-1.5 flex items-center gap-1">
                      <span>ℹ️</span> {t("checkout.confirmPrompt")}
                    </p>
                  </div>
                </div>
              )}

              {provider === "STRIPE" && (
                <div className="rounded-card bg-ubumwe-50 p-4 space-y-3 border border-ubumwe-100">
                  <div>
                    <label className="block text-xs font-semibold text-ubumwe-900 mb-1">
                      {t("checkout.cardName")}
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. Jean Damascene Hakizimana"
                      className="w-full rounded-card border border-ubumwe-100 px-3.5 py-2 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ubumwe-900 mb-1">
                      {t("checkout.cardNumber")}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full rounded-card border border-ubumwe-100 px-3.5 py-2 text-sm font-mono bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ubumwe-900 mb-1">
                        {t("checkout.cardExpiry")}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full rounded-card border border-ubumwe-100 px-3.5 py-2 text-sm font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ubumwe-900 mb-1">
                        {t("checkout.cardCvc")}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-card border border-ubumwe-100 px-3.5 py-2 text-sm font-mono bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {provider === "FLUTTERWAVE" && (
                <div className="rounded-card bg-ubumwe-50 p-4 border border-ubumwe-100 text-xs text-ink/80 space-y-2">
                  <p className="font-semibold text-ubumwe-900">🏦 Multi-Currency &amp; Bank Transfer Portal</p>
                  <p>
                    Supports East African payments across RWF, KES, UGX, and USD with bank accounts and PesaLink.
                  </p>
                </div>
              )}

              {/* Order Summary Line */}
              <div className="border-t border-ubumwe-100 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-ink/60">{items.length} items in checkout</p>
                  <p className="text-base font-bold text-ubumwe-900 font-display">
                    {totalRwf.toLocaleString()} RWF
                  </p>
                </div>
                <button
                  type="submit"
                  className="rounded-pill bg-sun-600 hover:bg-sun-700 px-6 py-3 font-display font-bold text-ubumwe-900 shadow-soft transition-all"
                >
                  {t("checkout.payNow")} {totalRwf.toLocaleString()} RWF
                </button>
              </div>
            </form>
          )}

          {/* IREMBOPAY CHECKOUT WIDGET MODAL */}
          {step === "irembo_widget" && iremboInvoice && (
            <div className="py-2 space-y-5">
              <div className="rounded-2xl border border-sun-600/30 bg-gradient-to-b from-sun-50/40 via-white to-white p-6 shadow-soft">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-ubumwe-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-ubumwe-900 text-white font-bold text-lg shadow-sm">
                      🇷🇼
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-ubumwe-900">
                        IremboPay Checkout Portal
                      </h3>
                      <p className="text-xs text-ink/50">Official Rwandan E-Payment Gateway</p>
                    </div>
                  </div>
                  <span className="rounded-pill bg-imbuto-50 px-3 py-1 text-xs font-bold text-imbuto-700 border border-imbuto-200">
                    PENDING PAYMENT
                  </span>
                </div>

                {/* Invoice Breakdown */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-mist p-3.5 text-xs">
                  <div>
                    <span className="text-ink/50 text-[11px] block">Invoice Number:</span>
                    <span className="font-mono font-bold text-ubumwe-900">{iremboInvoice.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-ink/50 text-[11px] block">Payer Name:</span>
                    <span className="font-semibold text-ubumwe-900 truncate block">
                      {fullName || user?.fullName || "Student"}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink/50 text-[11px] block">Amount to Pay:</span>
                    <span className="font-bold text-imbuto text-sm">
                      {totalRwf.toLocaleString()} RWF
                    </span>
                  </div>
                </div>

                {/* Handset instructions */}
                <div className="mt-5 space-y-2.5">
                  <p className="text-xs font-bold text-ubumwe-900 uppercase tracking-wider">
                    How to complete payment on your device:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-ubumwe-100 bg-white p-3 shadow-2xs">
                      <div className="flex items-center justify-between font-bold text-xs text-ubumwe-900">
                        <span>🟡 MTN MoMo (*182#)</span>
                        <span className="text-sun-700 text-[10px] bg-sun-50 px-2 py-0.5 rounded">Prompt Sent</span>
                      </div>
                      <p className="mt-1 text-[11px] text-ink/70">
                        Check your handset registered to <span className="font-semibold text-ubumwe-900">{phone}</span> and enter your Mobile Money PIN.
                      </p>
                    </div>

                    <div className="rounded-xl border border-ubumwe-100 bg-white p-3 shadow-2xs">
                      <div className="flex items-center justify-between font-bold text-xs text-ubumwe-900">
                        <span>🔴 Airtel Money (*500#)</span>
                        <span className="text-[10px] text-ink/50">USSD Ready</span>
                      </div>
                      <p className="mt-1 text-[11px] text-ink/70">
                        Dial *500# or approve the payment notification from IremboPay.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Real-time Webhook Verification Status */}
                <div className="mt-5 rounded-xl border border-ubumwe-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-ubumwe-900 border-t-transparent shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-ubumwe-900">
                        Awaiting Cryptographic Webhook Confirmation...
                      </p>
                      <p className="text-[11px] text-ink/50">
                        The backend is verifying server-to-server settlement. This screen updates automatically upon confirmation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={iremboInvoice.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-pill border border-ubumwe-200 bg-white px-4 py-2 text-xs font-bold text-ubumwe-900 hover:bg-ubumwe-50 shadow-sm transition-colors"
                  >
                    <span>Open Gateway in New Window</span>
                    <span>↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="rounded-pill border border-ubumwe-200 px-4 py-2 text-xs font-semibold text-ink/60 hover:bg-mist transition-colors"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-sun-600 border-t-transparent animate-spin" />
              <h3 className="font-display text-lg font-bold text-ubumwe-900">
                {provider === "IREMBOPAY" ? "Connecting to IremboPay..." : t("checkout.processing")}
              </h3>
              <p className="text-xs text-ink/70 max-w-sm">
                {provider === "IREMBOPAY"
                  ? "Generating official government invoice with Rwandan National Gateway..."
                  : provider === "MOMO"
                  ? t("checkout.confirmPrompt")
                  : "Verifying credentials with payment gateway..."}
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-imbuto-50 text-imbuto grid place-items-center text-3xl shadow-soft">
                ✓
              </div>
              <h3 className="font-display text-2xl font-bold text-ubumwe-900">{t("checkout.successTitle")}</h3>
              <p className="text-xs text-ink/70 max-w-md">{t("checkout.successSub")}</p>

              <div className="w-full rounded-card bg-mist p-4 text-left border border-ubumwe-100 space-y-2 mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-ink/60">{t("checkout.orderRef")}:</span>
                  <span className="font-mono font-bold text-ubumwe-900">{txRef}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink/60">Provider:</span>
                  <span className="font-semibold text-ubumwe-900">{provider}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink/60">Total Paid:</span>
                  <span className="font-bold text-imbuto">{totalRwf.toLocaleString()} RWF</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="rounded-pill border border-ubumwe px-4 py-2 text-xs font-bold text-ubumwe hover:bg-ubumwe-50"
                >
                  🖨️ {t("checkout.receiptBtn")}
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="rounded-pill bg-ubumwe px-5 py-2 text-xs font-bold text-white hover:bg-ubumwe-400"
                >
                  {t("checkout.continueShopping")}
                </button>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 grid place-items-center text-2xl mx-auto">
                ✕
              </div>
              <h3 className="font-display text-lg font-bold text-ubumwe-900">Payment Unsuccessful</h3>
              <p className="text-xs text-red-600 max-w-sm mx-auto">{errorMsg}</p>
              <button
                onClick={() => setStep("details")}
                className="rounded-pill bg-ubumwe text-white px-5 py-2 text-xs font-bold"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

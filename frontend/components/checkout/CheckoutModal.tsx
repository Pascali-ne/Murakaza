"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { payments } from "@/lib/api";

type Provider = "MOMO" | "STRIPE" | "FLUTTERWAVE";
type Telecom = "MTN" | "AIRTEL";
type CheckoutStep = "details" | "processing" | "success" | "error";

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, totalRwf, clearCart } = useCart();
  const { user } = useAuth();
  const { locale, t } = useLanguage();

  const [provider, setProvider] = useState<Provider>("MOMO");
  const [telecom, setTelecom] = useState<Telecom>("MTN");
  const [phone, setPhone] = useState("078");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  // Stripe Card fields
  const [cardName, setCardName] = useState(user?.fullName || "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [step, setStep] = useState<CheckoutStep>("details");
  const [txRef, setTxRef] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isCheckoutOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    setErrorMsg("");

    try {
      const payload = {
        amountCents: totalRwf * 100,
        currency: "RWF",
        provider,
        description: `Murakaza order: ${items.length} items (${items.map((i) => i.item.id).join(", ")})`,
      };

      const result = await payments.createIntent(payload);
      const reference = result.txRef || `MURA-${Date.now()}`;

      // Simulate payment processing time (USSD push for MoMo, Card processing for Stripe)
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
    setStep("details");
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
                <div className="grid grid-cols-3 gap-3">
                  {/* Mobile Money */}
                  <button
                    type="button"
                    onClick={() => setProvider("MOMO")}
                    className={`rounded-card p-3.5 border-2 text-left transition-all ${
                      provider === "MOMO"
                        ? "border-sun-600 bg-sun-100/30 shadow-soft"
                        : "border-ubumwe-100 hover:border-ubumwe-400 bg-mist"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📱</span>
                      <span className="font-display text-xs font-bold text-ubumwe-900">MoMo / Airtel</span>
                    </div>
                    <p className="text-[11px] text-ink/60 mt-1 line-clamp-1">MTN &amp; Airtel</p>
                  </button>

                  {/* Stripe Card */}
                  <button
                    type="button"
                    onClick={() => setProvider("STRIPE")}
                    className={`rounded-card p-3.5 border-2 text-left transition-all ${
                      provider === "STRIPE"
                        ? "border-sun-600 bg-sun-100/30 shadow-soft"
                        : "border-ubumwe-100 hover:border-ubumwe-400 bg-mist"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💳</span>
                      <span className="font-display text-xs font-bold text-ubumwe-900">Card (Stripe)</span>
                    </div>
                    <p className="text-[11px] text-ink/60 mt-1 line-clamp-1">Visa, Mastercard</p>
                  </button>

                  {/* Flutterwave */}
                  <button
                    type="button"
                    onClick={() => setProvider("FLUTTERWAVE")}
                    className={`rounded-card p-3.5 border-2 text-left transition-all ${
                      provider === "FLUTTERWAVE"
                        ? "border-sun-600 bg-sun-100/30 shadow-soft"
                        : "border-ubumwe-100 hover:border-ubumwe-400 bg-mist"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏦</span>
                      <span className="font-display text-xs font-bold text-ubumwe-900">Flutterwave</span>
                    </div>
                    <p className="text-[11px] text-ink/60 mt-1 line-clamp-1">Bank &amp; East Africa</p>
                  </button>
                </div>
              </div>

              {/* Dynamic Provider Input Fields */}
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

          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-sun-600 border-t-transparent animate-spin" />
              <h3 className="font-display text-lg font-bold text-ubumwe-900">{t("checkout.processing")}</h3>
              <p className="text-xs text-ink/70 max-w-sm">
                {provider === "MOMO" ? t("checkout.confirmPrompt") : "Verifying credentials with payment gateway..."}
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

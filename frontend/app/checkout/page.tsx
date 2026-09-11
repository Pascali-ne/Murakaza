"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { payments } from "@/lib/api";

type PaymentProvider = "IREMBOPAY" | "MOMO" | "FLUTTERWAVE" | "STRIPE";

export default function CheckoutPage() {
  const { cart, totalPriceRwf, clearCart } = useCart();
  const { locale } = useLanguage();

  const [provider, setProvider] = useState<PaymentProvider>("IREMBOPAY");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("078");
  const [pickupPoint, setPickupPoint] = useState("Kigali - Downtown Nyarugenge (Post Office)");
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const pickupLocations = [
    "Kigali - Downtown Nyarugenge (Post Office)",
    "Kigali - Remera (Giporoso Station)",
    "Kigali - Kicukiro (Sonatubes Hub)",
    "Musanze - Town Center Pickup",
    "Huye - University Avenue",
    "Rubavu - Gisenyi Bus Terminal",
    "Rwamagana - Commercial Center",
  ];

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    setError(null);

    const currentAmount = totalPriceRwf;
    setPaidAmount(currentAmount);

    try {
      if (provider === "IREMBOPAY" || provider === "MOMO") {
        const res = await payments.createIremboPayInvoice({
          amountRwf: currentAmount,
          description: `Murakaza order: ${cart.length} item(s) for ${fullName} (${phone})`,
          customer: { fullName, phone },
          items: cart.map((i) => ({ id: i.item.id, qty: i.quantity, price: i.item.priceRwf })),
        });
        setOrderComplete(res.invoiceNumber);
        clearCart();
        return;
      }

      const res = await payments.createIntent({
        amountCents: totalPriceRwf * 100,
        currency: "RWF",
        provider,
        description: `Murakaza order: ${cart.length} item(s) for ${fullName} (${phone})`,
      });

      const orderRef = res.txRef || `mrz_${Date.now()}`;
      setOrderComplete(orderRef);
      clearCart();
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment. Please verify details.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-imbuto-50 text-4xl text-imbuto-600">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-ubumwe-900">
          {locale === "rw" ? "Ubusabe bwemejwe!" : "Order Placed Successfully!"}
        </h1>
        <p className="mt-2 text-ink/70">
          {locale === "rw"
            ? `Numero y'ubusabe: ${orderComplete}. Reba ubutumwa bugufi (SMS) kuri telefone yawe.`
            : `Order reference: ${orderComplete}. Please check your phone for confirmation.`}
        </p>

        <div className="mt-8 rounded-card bg-white p-6 border border-ubumwe-100 text-left shadow-soft space-y-3">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-ubumwe-100">
            <span className="text-ink/60">{locale === "rw" ? "Amafaranga Yishyuwe:" : "Total Paid:"}</span>
            <span className="font-bold text-imbuto text-base">{paidAmount.toLocaleString()} RWF</span>
          </div>
          <div>
            <p className="text-sm font-bold text-ubumwe-900">
              {locale === "rw" ? "Aho gufatira ibikoresho:" : "Designated Pickup Point:"}
            </p>
            <p className="text-sm text-ink/80 mt-1">{pickupPoint}</p>
          </div>
          <p className="text-xs text-ink/50 mt-4">
            {locale === "rw"
              ? "Ukeneye ubufasha? Hamagara kuri 0788 000 111 cyangwa wandike kuri support@murakaza.rw"
              : "Questions? Call 0788 000 111 or email support@murakaza.rw"}
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-pill bg-ubumwe px-8 py-3.5 text-sm font-bold text-white hover:bg-ubumwe-900"
        >
          {locale === "rw" ? "Subira Ahabanza" : "Back to Home"}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-extrabold text-ubumwe-900">
        {locale === "rw" ? "Kwishyura" : "Checkout"}
      </h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        <form onSubmit={handlePay} className="md:col-span-7 space-y-6">
          <div className="rounded-card bg-white p-6 border border-ubumwe-100 shadow-soft">
            <h2 className="font-bold text-ubumwe-900 text-base mb-4">
              1. {locale === "rw" ? "Amakuru y'umunyeshuri/umubyeyi" : "Student & Contact Details"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink/70 uppercase">
                  {locale === "rw" ? "Amazina Yose" : "Full Name"}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Uwase Aline"
                  className="mt-1 w-full rounded-card border border-ubumwe-200 px-4 py-2.5 text-sm focus:border-ubumwe focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink/70 uppercase">
                  {locale === "rw" ? "Telefone (MTN / Airtel MoMo)" : "Phone Number (MTN / Airtel MoMo)"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="078... cyangwa 073..."
                  className="mt-1 w-full rounded-card border border-ubumwe-200 px-4 py-2.5 text-sm focus:border-ubumwe focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink/70 uppercase">
                  {locale === "rw" ? "Aho gufatira ibikoresho" : "Local Pickup Center"}
                </label>
                <select
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="mt-1 w-full rounded-card border border-ubumwe-200 px-4 py-2.5 text-sm focus:border-ubumwe focus:outline-none bg-white"
                >
                  {pickupLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-card bg-white p-6 border border-ubumwe-100 shadow-soft">
            <h2 className="font-bold text-ubumwe-900 text-base mb-4">
              2. {locale === "rw" ? "Uburyo bwo Kwishyura" : "Payment Method"}
            </h2>

            <div className="space-y-3">
              {[
                {
                  id: "IREMBOPAY",
                  title: "🇷🇼 IremboPay (Official Rwanda National Gateway)",
                  desc:
                    locale === "rw"
                      ? "Uburyo bwizewe bwa Leta: MTN MoMo (*182#), Airtel Money (*500#), na Amakarita"
                      : "Official Rwandan Gateway: MTN MoMo (*182#), Airtel Money (*500#), Visa/Mastercard",
                  badge: "Recommended",
                },
                {
                  id: "MOMO",
                  title: "MTN Mobile Money & Airtel Money",
                  desc:
                    locale === "rw"
                      ? "Kanda kuri telefone yawe wemeze umubare w'ibanga (*182#)"
                      : "Instant USSD prompt (*182#) sent to your phone",
                },
                {
                  id: "FLUTTERWAVE",
                  title: "Flutterwave Gateway",
                  desc: "Supports East African mobile wallets and local cards",
                },
                {
                  id: "STRIPE",
                  title: "International Credit / Debit Card (Stripe)",
                  desc: "Visa, Mastercard, American Express in RWF or USD",
                },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-card border p-4 transition-all ${
                    provider === m.id
                      ? "border-ubumwe bg-ubumwe-50/30"
                      : "border-ubumwe-100 hover:bg-mist/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={m.id}
                    checked={provider === m.id}
                    onChange={() => setProvider(m.id as PaymentProvider)}
                    className="mt-1 text-ubumwe"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ubumwe-900">{m.title}</span>
                      {m.badge && (
                        <span className="rounded-pill bg-sun-500/20 px-2 py-0.5 text-[10px] font-bold text-ubumwe-900">
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink/70 mt-0.5">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {error && <p className="mt-4 text-xs font-semibold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="mt-6 w-full rounded-pill bg-sun-600 py-3.5 text-sm font-bold text-ubumwe-900 shadow-soft hover:bg-sun-700 disabled:opacity-50"
            >
              {submitting
                ? locale === "rw" ? "Bitegereze..." : "Processing Payment..."
                : locale === "rw"
                ? `Ishyura ${totalPriceRwf.toLocaleString()} RWF ubu`
                : `Pay ${totalPriceRwf.toLocaleString()} RWF Now`}
            </button>
          </div>
        </form>

        <div className="md:col-span-5">
          <div className="sticky top-24 rounded-card bg-white p-6 border border-ubumwe-100 shadow-soft">
            <h2 className="font-bold text-ubumwe-900 text-base mb-4">
              {locale === "rw" ? "Incamake y'ibyo uguze" : "Order Summary"}
            </h2>

            <div className="divide-y divide-ubumwe-50 max-h-72 overflow-y-auto">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold text-ubumwe-900">{item.title[locale] || item.title.en}</p>
                    <p className="text-xs text-ink/50">Qty: {quantity}</p>
                  </div>
                  <span className="font-bold text-imbuto-600">
                    {(item.priceRwf * quantity).toLocaleString()} RWF
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-ubumwe-100 pt-4 flex justify-between items-center text-lg font-extrabold text-ubumwe-900">
              <span>{locale === "rw" ? "Igiteranyo cyose" : "Total Amount"}</span>
              <span className="text-imbuto-700">{totalPriceRwf.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

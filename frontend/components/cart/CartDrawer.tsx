"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalRwf, itemCount, openCheckout } = useCart();
  const { locale, t } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) closeCart();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-floating flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ubumwe-100 px-6 py-5 bg-mist">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-card bg-ubumwe text-white font-bold text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ubumwe-900">{t("cart.title")}</h2>
                <p className="text-xs text-ink/60 font-medium">
                  {itemCount} {t("cart.itemsCount")}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="grid h-8 w-8 place-items-center rounded-pill text-ink/60 hover:bg-ubumwe-50 hover:text-ubumwe transition-colors"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-ubumwe-50">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-ubumwe-50 grid place-items-center text-ubumwe mb-4">
                  <svg className="w-8 h-8 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-display text-base font-bold text-ubumwe-900">{t("cart.empty")}</h3>
                <p className="mt-1 text-xs text-ink/70 max-w-xs">{t("cart.emptySub")}</p>
                <button
                  onClick={closeCart}
                  className="mt-6 rounded-pill bg-ubumwe text-white px-5 py-2.5 text-xs font-bold hover:bg-ubumwe-400 transition-colors shadow-soft"
                >
                  {t("cart.browseCatalog")}
                </button>
              </div>
            ) : (
              items.map(({ item, quantity }) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  <img
                    src={item.image}
                    alt={item.title[locale]}
                    className="w-18 h-18 w-20 h-20 rounded-card object-cover border border-ubumwe-100 flex-shrink-0 bg-mist"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/products/${item.id}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-ubumwe-900 hover:text-ubumwe-400 line-clamp-2"
                      >
                        {item.title[locale]}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ink/40 hover:text-red-500 transition-colors p-1"
                        title={t("cart.removeItem")}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs text-ink/60 mt-0.5">
                      {item.type === "COURSE" ? "🎓 Course" : "🎒 School Supply"}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-ubumwe-100 rounded-pill bg-mist">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-ubumwe hover:bg-ubumwe-100 rounded-l-pill transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-bold text-ubumwe-900">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-ubumwe hover:bg-ubumwe-100 rounded-r-pill transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-ubumwe-900">
                        {(item.priceRwf * quantity).toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="border-t border-ubumwe-100 bg-mist p-6 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink/70">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-semibold text-ink">{totalRwf.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-ink/70">
                  <span>{t("cart.shipping")}</span>
                  <span className="font-bold text-imbuto text-xs uppercase bg-imbuto-50 px-2 py-0.5 rounded-pill">
                    {t("cart.free")}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-ubumwe-900 pt-2 border-t border-ubumwe-100">
                  <span>{t("cart.total")}</span>
                  <span className="text-lg text-ubumwe-900 font-display">{totalRwf.toLocaleString()} RWF</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full rounded-pill bg-sun-600 px-6 py-3.5 text-sm font-bold text-ubumwe-900 shadow-soft hover:bg-sun-700 transition-all flex items-center justify-center gap-2"
              >
                <span>{t("cart.checkout")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <p className="text-center text-[11px] text-ink/50">
                🇷🇼 MTN Mobile Money, Airtel Money, Stripe &amp; Flutterwave accepted
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

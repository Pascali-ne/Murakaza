"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPriceRwf, totalItems } = useCart();
  const { locale } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-ubumwe-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-ubumwe-100 px-6 py-5">
            <h2 className="text-lg font-bold text-ubumwe-900">
              {locale === "rw" ? "Ikarita yawe" : "Your Cart"} ({totalItems})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-full p-2 text-ink/50 hover:bg-mist hover:text-ink"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-ubumwe-50">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mist text-2xl text-ink/40">
                  🛒
                </div>
                <p className="mt-4 font-semibold text-ubumwe-900">
                  {locale === "rw" ? "Nta kintu kiri mu ikarita" : "Your cart is empty"}
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  {locale === "rw" ? "Hitamo ibikoresho cyangwa amasomo" : "Explore supplies or courses to get started"}
                </p>
              </div>
            ) : (
              cart.map(({ item, quantity }) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title[locale] || item.title.en}
                    className="h-16 w-16 rounded-card object-cover border border-ubumwe-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-ubumwe-900 truncate">
                      {item.title[locale] || item.title.en}
                    </h3>
                    <p className="text-xs font-bold text-imbuto-600 mt-0.5">
                      {item.priceRwf.toLocaleString()} RWF
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="h-6 w-6 rounded border border-ubumwe-200 text-xs font-bold text-ubumwe hover:bg-ubumwe-50"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold px-1">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="h-6 w-6 rounded border border-ubumwe-200 text-xs font-bold text-ubumwe hover:bg-ubumwe-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold p-1"
                  >
                    {locale === "rw" ? "Kuramo" : "Remove"}
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-ubumwe-100 bg-mist/50 p-6">
              <div className="flex justify-between text-base font-bold text-ubumwe-900 mb-4">
                <span>{locale === "rw" ? "Igiteranyo" : "Subtotal"}</span>
                <span className="text-imbuto-700">{totalPriceRwf.toLocaleString()} RWF</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full block text-center rounded-pill bg-sun-600 py-3.5 text-sm font-bold text-ubumwe-900 shadow-soft hover:bg-sun-700 transition-colors"
              >
                {locale === "rw" ? "Komeza wishyure (MoMo / Card)" : "Proceed to Checkout (MoMo / Card)"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

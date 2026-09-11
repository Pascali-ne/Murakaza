"use client";

import { useEffect, useState } from "react";
import { catalog, CatalogItem } from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SupplyGrid() {
  const { locale, t } = useLanguage();
  const { addToCart } = useCart();
  const [supplies, setSupplies] = useState<CatalogItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [
    { key: "all", label: locale === "rw" ? "Byose" : "All Supplies" },
    { key: "stationery", label: locale === "rw" ? "Ibitabo n'amakaye" : "Stationery" },
    { key: "instruments", label: locale === "rw" ? "Imibare & Ibikoresho" : "Instruments" },
    { key: "backpacks", label: locale === "rw" ? "Ibikapu" : "Backpacks" },
    { key: "electronics", label: locale === "rw" ? "Calculatrices" : "Calculators" },
    { key: "uniforms", label: locale === "rw" ? "Imyenda" : "Uniforms" },
    { key: "stem", label: locale === "rw" ? "Ibikoresho bya STEM" : "STEM Kits" },
  ];

  useEffect(() => {
    setLoading(true);
    catalog
      .list({ type: "SUPPLY", category: selectedCategory === "all" ? undefined : selectedCategory })
      .then((res) => {
        setSupplies(res.supplies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <section id="supplies" className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-imbuto-600">
            {locale === "rw" ? "Ibikoresho by'ishuri" : "School Supplies"}
          </span>
          <h2 className="mt-1 text-2xl font-bold text-ubumwe-900 md:text-3xl">
            {t("supplies.title")}
          </h2>
          <p className="mt-2 max-w-prose text-ink/70">
            {t("supplies.description")}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`whitespace-nowrap rounded-pill px-4 py-2 text-xs font-bold transition-colors ${
              selectedCategory === cat.key
                ? "bg-ubumwe text-white"
                : "bg-white text-ink/70 hover:bg-ubumwe-50 border border-ubumwe-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 animate-pulse rounded-card bg-white p-4" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supplies.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-card bg-white border border-ubumwe-100/60 shadow-soft hover:shadow-floating transition-shadow"
            >
              <div className="relative h-48 w-full overflow-hidden bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title[locale] || item.title.en}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {item.badge && (
                  <span className="absolute left-3 top-3 rounded-pill bg-ubumwe px-2.5 py-1 text-xs font-bold text-white shadow-soft">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-1 text-xs text-sun-600 font-semibold mb-1">
                  <span>★</span>
                  <span>{item.rating}</span>
                  <span className="text-ink/40">({item.reviewsCount})</span>
                </div>

                <h3 className="font-bold text-ubumwe-900 leading-snug">
                  {item.title[locale] || item.title.en}
                </h3>
                <p className="mt-2 text-xs text-ink/70 line-clamp-2 flex-1">
                  {item.description[locale] || item.description.en}
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-ubumwe-50">
                  <span className="font-display text-base font-extrabold text-imbuto-700">
                    {item.priceRwf.toLocaleString()} RWF
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="rounded-pill bg-sun-600 px-4 py-2 text-xs font-bold text-ubumwe-900 shadow-soft hover:bg-sun-700 active:scale-95 transition-all"
                  >
                    {locale === "rw" ? "+ Shyira mu ikarita" : "+ Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

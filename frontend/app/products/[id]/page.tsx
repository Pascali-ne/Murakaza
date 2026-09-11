"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { catalog } from "@/lib/api";
import { CATALOG_ITEMS, DetailedCatalogItem } from "@/lib/catalogData";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/catalog/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const { locale, t } = useLanguage();
  const { addItem, openCheckout } = useCart();

  const [item, setItem] = useState<DetailedCatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "syllabus" | "specs">("details");

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    catalog
      .getById(id)
      .then((res) => {
        // Merge with detailed data if available
        const rich = CATALOG_ITEMS.find((ci) => ci.id === id) || (res.item as DetailedCatalogItem);
        setItem(rich);
        setLoading(false);
      })
      .catch(() => {
        const found = CATALOG_ITEMS.find((ci) => ci.id === id);
        setItem(found || null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[4/3] rounded-card bg-white border border-ubumwe-100" />
          <div className="space-y-4">
            <div className="h-6 w-24 bg-ubumwe-100 rounded-pill" />
            <div className="h-10 w-3/4 bg-ubumwe-100 rounded" />
            <div className="h-6 w-1/3 bg-ubumwe-100 rounded" />
            <div className="h-32 bg-ubumwe-50 rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 grid place-items-center text-2xl mx-auto mb-4">
          ✕
        </div>
        <h1 className="font-display text-2xl font-bold text-ubumwe-900">Product Not Found</h1>
        <p className="mt-2 text-sm text-ink/70">The item you requested does not exist or has been removed.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-pill bg-ubumwe px-6 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-ubumwe-400"
        >
          {t("product.backToCatalog")}
        </Link>
      </div>
    );
  }

  const isCourse = item.type === "COURSE";
  const relatedItems = CATALOG_ITEMS.filter((ci) => ci.id !== item.id && ci.type === item.type).slice(0, 3);

  const handleAddToCart = () => {
    addItem(item, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(item, quantity);
    openCheckout();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-ink/60">
        <Link href="/" className="hover:text-ubumwe transition-colors">
          {t("nav.home")}
        </Link>
        <span>/</span>
        <Link href={isCourse ? "/#courses" : "/#supplies"} className="hover:text-ubumwe transition-colors">
          {isCourse ? t("nav.courses") : t("nav.supplies")}
        </Link>
        <span>/</span>
        <span className="text-ubumwe-900 font-semibold truncate max-w-xs">{item.title[locale]}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Media & Highlights */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-card overflow-hidden bg-white border border-ubumwe-100 shadow-soft">
            <img
              src={item.image}
              alt={item.title[locale]}
              className="h-full w-full object-cover"
            />
            {item.badge && (
              <span className="absolute top-4 left-4 rounded-pill bg-sun-600 px-3 py-1 text-xs font-bold text-ubumwe-900 shadow-sm">
                {item.badge}
              </span>
            )}
            {item.certification && (
              <span className="absolute bottom-4 left-4 rounded-pill bg-ubumwe/90 backdrop-blur text-white px-3 py-1 text-xs font-bold shadow-sm">
                🏅 {item.certification.label[locale]}
              </span>
            )}
          </div>

          {/* Key Bullet Highlights */}
          {item.features && (
            <div className="rounded-card bg-white border border-ubumwe-100 p-5 shadow-soft">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-ubumwe-900 mb-3">
                Key Highlights
              </h4>
              <ul className="space-y-2">
                {item.features[locale]?.map((feat, idx) => (
                  <li key={idx} className="text-xs text-ink/80 flex items-start gap-2">
                    <span className="text-imbuto font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Title, Pricing, Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-pill bg-ubumwe-50 text-ubumwe px-3 py-0.5 text-xs font-bold uppercase">
                {isCourse ? "🎓 " + t("catalog.coursesTab") : "🎒 " + t("catalog.suppliesTab")}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-ubumwe-900">
                <span className="text-yellow-500">★</span>
                <span>{item.rating.toFixed(1)}</span>
                <span className="text-ink/50">({item.reviewsCount} {t("product.reviews")})</span>
              </div>
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold text-ubumwe-900 leading-tight">
              {item.title[locale]}
            </h1>

            {/* Course tags or Supply Stock */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {isCourse ? (
                <>
                  <span className="rounded-pill bg-imbuto-50 text-imbuto font-semibold px-2.5 py-1">
                    ⏱️ {t("product.duration")}: {item.duration}
                  </span>
                  <span className="rounded-pill bg-mist border border-ubumwe-100 text-ink/70 font-medium px-2.5 py-1">
                    📊 {t("product.level")}: {item.level}
                  </span>
                  {item.instructor && (
                    <span className="rounded-pill bg-ubumwe-50 text-ubumwe font-semibold px-2.5 py-1">
                      👨‍🏫 {item.instructor}
                    </span>
                  )}
                </>
              ) : (
                <span className="rounded-pill bg-imbuto-50 text-imbuto font-semibold px-2.5 py-1">
                  ✓ {item.stock ? `${item.stock} ${t("product.unitsAvailable")}` : t("product.inStock")}
                </span>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="rounded-card bg-mist border border-ubumwe-100 p-5 space-y-1">
            <span className="text-xs font-bold uppercase text-ink/50 tracking-wider">Unit Price</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-ubumwe-900">
                {item.priceRwf.toLocaleString()}
              </span>
              <span className="text-base font-bold text-ink/70">RWF</span>
            </div>
            <p className="text-[11px] text-ink/60 pt-1">
              {t("product.deliveryInfo")}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-ink/80 leading-relaxed">
            {item.description[locale]}
          </p>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase text-ubumwe-900">
                {t("product.quantity")}:
              </label>
              <div className="flex items-center rounded-pill border border-ubumwe-100 bg-white shadow-soft">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 text-sm font-bold text-ubumwe hover:bg-ubumwe-50 rounded-l-pill"
                >
                  −
                </button>
                <span className="px-4 text-sm font-bold text-ubumwe-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-1.5 text-sm font-bold text-ubumwe hover:bg-ubumwe-50 rounded-r-pill"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`rounded-pill px-6 py-3.5 text-sm font-bold transition-all shadow-soft flex items-center justify-center gap-2 ${
                  added
                    ? "bg-imbuto text-white"
                    : "bg-ubumwe text-white hover:bg-ubumwe-400"
                }`}
              >
                <span>{added ? "✓" : "🛒"}</span>
                <span>{added ? t("product.addedToCart") : t("product.addToCart")}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="rounded-pill bg-sun-600 hover:bg-sun-700 px-6 py-3.5 text-sm font-bold text-ubumwe-900 shadow-soft transition-all flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>{t("product.buyNow")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Details Tabs (Syllabus or Specifications) */}
      <div className="mt-16 pt-8 border-t border-ubumwe-100">
        <div className="flex border-b border-ubumwe-100 mb-6 gap-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-sm font-bold transition-colors ${
              activeTab === "details"
                ? "border-b-2 border-ubumwe text-ubumwe"
                : "text-ink/60 hover:text-ubumwe"
            }`}
          >
            Overview &amp; Details
          </button>
          {isCourse && item.syllabus && (
            <button
              onClick={() => setActiveTab("syllabus")}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === "syllabus"
                  ? "border-b-2 border-ubumwe text-ubumwe"
                  : "text-ink/60 hover:text-ubumwe"
              }`}
            >
              {t("product.syllabus")}
            </button>
          )}
          {!isCourse && item.specifications && (
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 text-sm font-bold transition-colors ${
                activeTab === "specs"
                  ? "border-b-2 border-ubumwe text-ubumwe"
                  : "text-ink/60 hover:text-ubumwe"
              }`}
            >
              {t("product.specs")}
            </button>
          )}
        </div>

        {activeTab === "details" && (
          <div className="rounded-card bg-white border border-ubumwe-100 p-6 shadow-soft space-y-4">
            <h3 className="font-display text-base font-bold text-ubumwe-900">About this item</h3>
            <p className="text-sm text-ink/80 leading-relaxed">{item.description[locale]}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-ubumwe-50 text-xs">
              <div className="p-3 bg-mist rounded-card">
                <span className="font-bold text-ubumwe-900 block">Rwanda Curriculum</span>
                <span className="text-ink/60">Fully compliant with REB &amp; NESA examination codes.</span>
              </div>
              <div className="p-3 bg-mist rounded-card">
                <span className="font-bold text-ubumwe-900 block">Local Pick-up &amp; Support</span>
                <span className="text-ink/60">Available at partner school hubs and logistics points.</span>
              </div>
              <div className="p-3 bg-mist rounded-card">
                <span className="font-bold text-ubumwe-900 block">Secure Mobile Payment</span>
                <span className="text-ink/60">Pay seamlessly with MTN MoMo (*182#) or Airtel Money.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "syllabus" && isCourse && item.syllabus && (
          <div className="space-y-4">
            {item.syllabus[locale]?.map((mod, i) => (
              <div key={i} className="rounded-card bg-white border border-ubumwe-100 p-5 shadow-soft">
                <h4 className="font-display text-sm font-bold text-ubumwe-900 mb-2">{mod.module}</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink/80">
                  {mod.topics.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-imbuto">▪</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === "specs" && !isCourse && item.specifications && (
          <div className="rounded-card bg-white border border-ubumwe-100 p-6 shadow-soft">
            <dl className="divide-y divide-ubumwe-50">
              {Object.entries(item.specifications).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between text-xs">
                  <dt className="font-bold text-ubumwe-900">{key}</dt>
                  <dd className="text-ink/70 font-medium">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedItems.length > 0 && (
        <section className="mt-20">
          <h3 className="font-display text-xl font-bold text-ubumwe-900 mb-6">
            {t("product.relatedTitle")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((rel) => (
              <ProductCard key={rel.id} item={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

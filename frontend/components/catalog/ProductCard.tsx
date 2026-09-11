"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CatalogItem } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  item: CatalogItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const { locale, t } = useLanguage();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const isCourse = item.type === "COURSE";

  return (
    <article className="group flex flex-col rounded-card bg-white border border-ubumwe-100 overflow-hidden shadow-soft hover:shadow-floating hover:border-ubumwe-400 transition-all duration-200">
      {/* Media / Image Container */}
      <Link href={`/products/${item.id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-mist">
        <img
          src={item.image}
          alt={item.title[locale]}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.badge && (
            <span className="rounded-pill bg-sun-600 px-2.5 py-0.5 text-[11px] font-bold text-ubumwe-900 shadow-sm">
              {item.badge}
            </span>
          )}
          <span className="rounded-pill bg-ubumwe/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {isCourse ? "🎓 " + t("catalog.coursesTab") : "🎒 " + t("catalog.suppliesTab")}
          </span>
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-pill bg-white/95 backdrop-blur-sm px-2 py-0.5 text-xs font-bold text-ubumwe-900 shadow-sm">
          <span className="text-yellow-500">★</span>
          <span>{item.rating.toFixed(1)}</span>
          <span className="text-[10px] text-ink/50 font-normal">({item.reviewsCount})</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          {/* Metadata tags (Course duration/instructor or Supply stock) */}
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-ink/60">
            {isCourse ? (
              <>
                <span className="text-imbuto font-semibold">{item.duration}</span>
                <span>•</span>
                <span>{item.level}</span>
              </>
            ) : (
              <span className="text-imbuto font-semibold">
                ✓ {item.stock ? `${item.stock} in stock` : t("product.inStock")}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/products/${item.id}`}>
            <h3 className="font-display text-sm font-bold text-ubumwe-900 line-clamp-2 hover:text-ubumwe transition-colors leading-snug">
              {item.title[locale]}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="mt-1.5 text-xs text-ink/70 line-clamp-2">
            {item.description[locale]}
          </p>

          {/* Instructor label for courses */}
          {isCourse && item.instructor && (
            <p className="mt-2 text-[11px] text-ubumwe-600 font-semibold truncate">
              👨‍🏫 {item.instructor}
            </p>
          )}
        </div>

        {/* Price & CTA Action */}
        <div className="mt-4 pt-3 border-t border-ubumwe-50 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink/50 block leading-none">Price</span>
            <span className="font-display text-base font-bold text-ubumwe-900">
              {item.priceRwf.toLocaleString()} <span className="text-xs font-semibold">RWF</span>
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`rounded-pill px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              added
                ? "bg-imbuto text-white"
                : "bg-sun-600 text-ubumwe-900 hover:bg-sun-700 active:scale-95"
            }`}
            aria-label="Add to cart"
          >
            {added ? (
              <>
                <span>✓</span>
                <span>{t("product.addedToCart")}</span>
              </>
            ) : (
              <>
                <span>+</span>
                <span>{t("product.addToCart")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

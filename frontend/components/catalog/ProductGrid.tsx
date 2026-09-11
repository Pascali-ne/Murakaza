"use client";

import React, { useEffect, useState, useMemo } from "react";
import { catalog, CatalogItem } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

interface ProductGridProps {
  initialType?: "ALL" | "SUPPLY" | "COURSE";
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

export default function ProductGrid({
  initialType = "ALL",
  title,
  subtitle,
  showFilters = true,
}: ProductGridProps) {
  const { t } = useLanguage();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "SUPPLY" | "COURSE">(initialType);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    catalog
      .list()
      .then((data) => {
        if (isMounted) {
          setItems(data.items || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter items in memory for instantaneous UX
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (selectedType !== "ALL" && item.type !== selectedType) return false;

      // Category filter
      if (selectedCategory !== "all" && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEn = item.title.en.toLowerCase().includes(q) || item.description.en.toLowerCase().includes(q);
        const matchesRw = item.title.rw.toLowerCase().includes(q) || item.description.rw.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesEn && !matchesRw && !matchesCat) return false;
      }

      return true;
    });
  }, [items, selectedType, selectedCategory, searchQuery]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedType(initialType);
    setSelectedCategory("all");
  };

  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <div>
          {title && <h2 className="font-display text-2xl md:text-3xl font-bold text-ubumwe-900">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-ink/70 max-w-prose">{subtitle}</p>}
        </div>
      )}

      {showFilters && (
        <ProductFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onReset={handleReset}
        />
      )}

      {/* Grid Display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-80 rounded-card bg-white border border-ubumwe-100/50 p-4 animate-pulse space-y-3"
            >
              <div className="h-40 bg-ubumwe-50 rounded-card" />
              <div className="h-4 bg-ubumwe-50 rounded w-3/4" />
              <div className="h-3 bg-ubumwe-50 rounded w-1/2" />
              <div className="h-8 bg-ubumwe-50 rounded-pill mt-4" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-card bg-white border border-ubumwe-100 p-12 text-center shadow-soft">
          <div className="w-16 h-16 rounded-full bg-sun-100/50 text-sun-700 grid place-items-center text-2xl mx-auto mb-3">
            🔍
          </div>
          <h3 className="font-display text-base font-bold text-ubumwe-900">{t("catalog.noResults")}</h3>
          <p className="text-xs text-ink/60 mt-1 max-w-md mx-auto">
            Try adjusting your search terms or resetting the category filter.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 rounded-pill bg-ubumwe text-white px-5 py-2 text-xs font-bold hover:bg-ubumwe-400 transition-colors shadow-soft"
          >
            {t("catalog.clearFilters")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

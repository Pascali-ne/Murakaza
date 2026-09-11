"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedType: "ALL" | "SUPPLY" | "COURSE";
  setSelectedType: (t: "ALL" | "SUPPLY" | "COURSE") => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  onReset: () => void;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  onReset,
}: ProductFiltersProps) {
  const { t } = useLanguage();

  const categories = [
    { id: "all", label: t("catalog.categories.all") },
    { id: "stationery", label: t("catalog.categories.stationery") },
    { id: "instruments", label: t("catalog.categories.instruments") },
    { id: "backpacks", label: t("catalog.categories.backpacks") },
    { id: "electronics", label: t("catalog.categories.electronics") },
    { id: "uniforms", label: t("catalog.categories.uniforms") },
    { id: "stem", label: t("catalog.categories.stem") },
    { id: "coding", label: t("catalog.categories.coding") },
    { id: "languages", label: t("catalog.categories.languages") },
  ];

  const hasActiveFilters = searchQuery !== "" || selectedType !== "ALL" || selectedCategory !== "all";

  return (
    <div className="space-y-4">
      {/* Top Bar: Search + Type Tabs */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ubumwe/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("catalog.searchPlaceholder")}
            className="w-full pl-10 pr-9 py-2.5 rounded-pill border border-ubumwe-100 bg-white text-sm text-ink placeholder-ink/40 shadow-soft focus:border-ubumwe focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>

        {/* Type Filter Tabs */}
        <div className="flex rounded-pill border border-ubumwe-100 bg-white p-1 shadow-soft">
          {(
            [
              { id: "ALL", label: t("catalog.all"), icon: "✨" },
              { id: "SUPPLY", label: t("catalog.suppliesTab"), icon: "🎒" },
              { id: "COURSE", label: t("catalog.coursesTab"), icon: "🎓" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-bold transition-colors ${
                selectedType === tab.id
                  ? "bg-ubumwe text-white shadow-sm"
                  : "text-ink/70 hover:text-ubumwe hover:bg-ubumwe-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-ubumwe-900 whitespace-nowrap mr-1">
          {t("catalog.filterLabel")}:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-pill text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? "bg-imbuto text-white font-bold shadow-soft"
                : "bg-white border border-ubumwe-100 text-ink/70 hover:bg-ubumwe-50 hover:text-ubumwe"
            }`}
          >
            {cat.label}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="whitespace-nowrap px-3 py-1 rounded-pill text-xs font-bold text-red-600 hover:bg-red-50 transition-colors ml-auto"
          >
            ✕ {t("catalog.clearFilters")}
          </button>
        )}
      </div>
    </div>
  );
}

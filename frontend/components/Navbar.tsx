"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#supplies", label: t("nav.supplies") },
    { href: "/#courses", label: t("nav.courses") },
    { href: "/#feedback", label: t("nav.feedback") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ubumwe-100/60 bg-mist/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-card bg-ubumwe text-sm font-bold text-white shadow-soft">
            M
          </span>
          <span className="font-display text-lg font-bold text-ubumwe-900">Murakaza</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink/80 hover:text-ubumwe transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex rounded-pill border border-ubumwe-100 bg-white p-1 text-xs font-semibold">
            {(["en", "rw"] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                className={`rounded-pill px-3 py-1 transition-colors ${
                  locale === code ? "bg-ubumwe text-white" : "text-ubumwe hover:bg-ubumwe-50"
                }`}
              >
                {t(`languageSwitch.${code}`)}
              </button>
            ))}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative grid h-9 w-9 place-items-center rounded-card border border-ubumwe-200 bg-white text-ubumwe hover:bg-ubumwe-50 transition-colors"
            title="View Cart"
          >
            <span className="text-sm">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sun-600 text-[10px] font-bold text-ubumwe-900 shadow-soft">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            href="/login"
            className="hidden rounded-pill px-4 py-2 text-sm font-semibold text-ubumwe hover:bg-ubumwe-50 md:inline-block"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/signup"
            className="hidden rounded-pill bg-sun-600 px-4 py-2 text-sm font-bold text-ubumwe-900 shadow-soft hover:bg-sun-700 md:inline-block"
          >
            {t("nav.signup")}
          </Link>

          <button
            className="grid h-9 w-9 place-items-center rounded-card border border-ubumwe-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1">
              <span className="h-0.5 w-4 bg-ubumwe" />
              <span className="h-0.5 w-4 bg-ubumwe" />
              <span className="h-0.5 w-4 bg-ubumwe" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ubumwe-100/60 bg-mist px-5 py-3 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="py-2 text-sm font-medium text-ink/80" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="py-2 text-sm font-semibold text-ubumwe">
            {t("nav.login")}
          </Link>
          <Link href="/signup" className="py-2 text-sm font-semibold text-sun-700">
            {t("nav.signup")}
          </Link>
        </nav>
      )}
    </header>
  );
}

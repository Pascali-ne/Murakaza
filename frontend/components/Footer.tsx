"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { locale, t } = useLanguage();

  return (
    <footer className="border-t border-ubumwe-100 bg-white mt-12">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-card bg-ubumwe text-xs font-bold text-white">
                M
              </span>
              <span className="font-display text-lg font-bold text-ubumwe-900">Murakaza</span>
            </Link>
            <p className="mt-3 text-sm text-ink/70 max-w-sm">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-pill bg-imbuto-50 px-3 py-1 text-xs font-bold text-imbuto-700">
                🇷🇼 Kigali, Rwanda
              </span>
              <span className="text-xs font-semibold text-ink/60">
                MTN MoMo • Airtel Money • Visa • Mastercard
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ubumwe-900">
              {locale === "rw" ? "Ibyiciro" : "Explore"}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li><a href="/#supplies" className="hover:text-ubumwe">{t("nav.supplies")}</a></li>
              <li><a href="/#courses" className="hover:text-ubumwe">{t("nav.courses")}</a></li>
              <li><a href="/#feedback" className="hover:text-ubumwe">{t("nav.feedback")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ubumwe-900">
              {locale === "rw" ? "Ubuyobozi" : "Admin & Portal"}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li><Link href="/admin" className="hover:text-ubumwe">{t("nav.admin")}</Link></li>
              <li><Link href="/login" className="hover:text-ubumwe">{t("nav.login")}</Link></li>
              <li><Link href="/signup" className="hover:text-ubumwe">{t("nav.signup")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ubumwe-50 pt-6 text-center text-xs text-ink/50">
          © {new Date().getFullYear()} Murakaza EdTech Ltd. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}

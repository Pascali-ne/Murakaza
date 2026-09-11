"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import en from "./en.json";
import rw from "./rw.json";

type Locale = "en" | "rw";

const dictionaries: Record<Locale, Record<string, unknown>> = { en, rw };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function resolvePath(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Persist the visitor's choice and respect it on return visits.
  useEffect(() => {
    const stored = window.localStorage.getItem("murakaza_locale") as Locale | null;
    if (stored === "en" || stored === "rw") setLocaleState(stored);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("murakaza_locale", next);
  };

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (path: string) => resolvePath(dict, path);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

/** Pulls the right language out of a CMS `localizedFields` JSONB blob. */
export function useLocalizedField(localizedFields: { en?: Record<string, string>; rw?: Record<string, string> } | undefined, field: string) {
  const { locale } = useLanguage();
  if (!localizedFields) return "";
  return localizedFields[locale]?.[field] ?? localizedFields.en?.[field] ?? "";
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SignupPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await auth.register({ fullName, email, password });
      localStorage.setItem("murakaza_access_token", res.accessToken);
      document.cookie = `murakaza_access_token=${res.accessToken}; path=/; max-age=7200; SameSite=Lax`;
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-card bg-white p-8 border border-ubumwe-100 shadow-soft">
        <div className="text-center mb-6">
          <span className="inline-grid h-12 w-12 place-items-center rounded-card bg-sun-600 text-lg font-bold text-ubumwe-900 mb-2">
            M
          </span>
          <h1 className="text-2xl font-bold text-ubumwe-900">
            {locale === "rw" ? "Fungura Konti Nshya" : "Create Your Account"}
          </h1>
          <p className="mt-1 text-xs text-ink/60">
            {locale === "rw"
              ? "Tangira kugura ibikoresho n'amasomo y'umunyeshuri wawe"
              : "Get started with supplies and guided revision courses"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-card bg-red-50 p-3 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink/70 uppercase">
              {locale === "rw" ? "Amazina Yose" : "Full Name"}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-card border border-ubumwe-200 px-4 py-2.5 text-sm focus:border-ubumwe focus:outline-none"
              placeholder="e.g. Jean-Paul Kagabo"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink/70 uppercase">
              {locale === "rw" ? "Imeli" : "Email Address"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-card border border-ubumwe-200 px-4 py-2.5 text-sm focus:border-ubumwe focus:outline-none"
              placeholder="jeanpaul@example.rw"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink/70 uppercase">
              {locale === "rw" ? "Ijambo ry'Ibanga" : "Password (Min 8 characters)"}
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-card border border-ubumwe-200 px-4 py-2.5 text-sm focus:border-ubumwe focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-pill bg-sun-600 py-3 text-sm font-bold text-ubumwe-900 shadow-soft hover:bg-sun-700 disabled:opacity-50"
          >
            {loading
              ? locale === "rw" ? "Gukora konti..." : "Creating account..."
              : locale === "rw" ? "Tangira" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink/70">
          {locale === "rw" ? "Usanzwe ufite konti?" : "Already have an account?"}{" "}
          <Link href="/login" className="font-bold text-ubumwe hover:underline">
            {locale === "rw" ? "Injira hano" : "Log in here"}
          </Link>
        </p>
      </div>
    </div>
  );
}

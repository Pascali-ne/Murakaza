"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const { locale } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await auth.login(email, password);
      localStorage.setItem("murakaza_access_token", res.accessToken);
      document.cookie = `murakaza_access_token=${res.accessToken}; path=/; max-age=7200; SameSite=Lax`;

      if (res.user.role === "ADMIN" && nextUrl === "/") {
        router.push("/admin");
      } else {
        router.push(nextUrl);
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-card bg-white p-8 border border-ubumwe-100 shadow-soft">
      <div className="text-center mb-6">
        <span className="inline-grid h-12 w-12 place-items-center rounded-card bg-ubumwe text-lg font-bold text-white mb-2">
          M
        </span>
        <h1 className="text-2xl font-bold text-ubumwe-900">
          {locale === "rw" ? "Injira muri Murakaza" : "Log in to Murakaza"}
        </h1>
        <p className="mt-1 text-xs text-ink/60">
          {locale === "rw"
            ? "Komeza ku ikarita yawe n'amasomo yose"
            : "Access your student courses, supplies, and orders"}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-card bg-red-50 p-3 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="umubyeyi@gmail.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-ink/70 uppercase">
            {locale === "rw" ? "Ijambo ry'Ibanga" : "Password"}
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-card border border-ubumwe-200 px-4 py-2.5 text-sm focus:border-ubumwe focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-pill bg-ubumwe py-3 text-sm font-bold text-white hover:bg-ubumwe-900 disabled:opacity-50 transition-colors"
        >
          {loading
            ? locale === "rw" ? "Kwinjira..." : "Logging in..."
            : locale === "rw" ? "Injira" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink/70">
        {locale === "rw" ? "Nta konti ufite?" : "Don't have an account yet?"}{" "}
        <Link href="/signup" className="font-bold text-ubumwe hover:underline">
          {locale === "rw" ? "Iyandikishe hano" : "Sign up here"}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-white" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

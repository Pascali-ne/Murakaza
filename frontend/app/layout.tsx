import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Murakaza — School supplies & courses for Rwandan students",
  description:
    "Murakaza connects Rwandan families to affordable school supplies and guided courses, with Mobile Money checkout and bilingual support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${inter.variable} font-body bg-mist text-ink antialiased min-h-screen flex flex-col`}>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <CartDrawer />
              <CheckoutModal />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

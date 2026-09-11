import type { Config } from "tailwindcss";

// Murakaza design tokens
// Color: deep "Ubumwe" blue (primary/headlines) + "Imbuto" green (secondary/success)
// + "Sun" gold (primary CTA accent) on a cool-neutral "Mist" backdrop —
// deliberately avoiding the generic warm-cream/terracotta AI-default palette.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ubumwe: {
          DEFAULT: "#0F3D5C",
          50: "#EAF1F7",
          100: "#CBDEEC",
          400: "#1E5A82",
          600: "#0F3D5C",
          900: "#081F2E",
        },
        imbuto: {
          DEFAULT: "#1F7A4D",
          50: "#EAF3EE",
          100: "#C9E6D4",
          600: "#1F7A4D",
          900: "#123D28",
        },
        sun: {
          DEFAULT: "#F2B705",
          100: "#FCEBB0",
          600: "#F2B705",
          700: "#C99500",
        },
        mist: "#F3F6F5",
        ink: "#14212B",
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
      boxShadow: {
        floating: "0 20px 40px -12px rgba(15, 61, 92, 0.25)",
        soft: "0 8px 24px -8px rgba(20, 33, 43, 0.12)",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;

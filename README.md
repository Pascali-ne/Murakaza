# Murakaza

A bilingual (EN/RW) EdTech commerce platform: school supplies, courses, an
admin CMS, and Mobile Money / card payments — built for Vercel + Render + Neon.

```
murakaza/
├── database/
│   ├── schema.prisma        # Prisma schema (source of truth)
│   └── schema.sql           # Equivalent raw DDL for Neon
├── backend/                 # Render — Node.js/Express API
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/{auth,cors,rateLimit,errorHandler}.js
│   ├── routes/{auth,cms,payments,feedback}.js
│   └── controllers/{authController,cmsController,paymentsController,feedbackController}.js
└── frontend/                 # Vercel — Next.js 14 (App Router) + Tailwind
    ├── app/{layout,page}.tsx, app/admin/page.tsx
    ├── components/{Navbar,HeroBanner,FeedbackForm}.tsx
    ├── components/admin/{AdminDashboard,CmsEditor}.tsx
    └── lib/{api.ts, i18n/*}
```

## 1. Neon PostgreSQL

1. Create a Neon project and copy the pooled connection string (for `DATABASE_URL`)
   and the direct connection string (for `DIRECT_URL` — required by Prisma migrations).
2. Apply the schema:
   ```bash
   cd backend
   npx prisma migrate deploy   # or: psql "$DIRECT_URL" -f ../database/schema.sql
   ```
3. Seed one admin user (hash a password with bcrypt first, then insert it directly —
   there's no public "become admin" endpoint by design).

## 2. Backend (Render)

1. New **Web Service** → point at `backend/`, build command `npm install && npx prisma generate`,
   start command `npm start`.
2. Set all variables from `backend/.env.example` in Render's dashboard, in particular:
   - `DATABASE_URL` / `DIRECT_URL` (Neon)
   - `JWT_SECRET`
   - `FRONTEND_ORIGIN` — your Vercel URL(s), comma-separated for prod + previews
   - `REDIS_URL` — an Upstash/Redis instance for cross-instance rate limiting
   - `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`, and/or `FLUTTERWAVE_SECRET_KEY` / `FLUTTERWAVE_WEBHOOK_HASH`, and/or MoMo credentials
3. Register the webhook URLs with each provider:
   - Stripe: `https://<render-app>.onrender.com/api/payments/webhook/stripe`
   - Flutterwave: `https://<render-app>.onrender.com/api/payments/webhook/flutterwave`

## 3. Frontend (Vercel)

1. New Project → point at `frontend/`.
2. Set `NEXT_PUBLIC_API_URL` to the Render service URL.
3. The admin route (`/admin`) expects an httpOnly `murakaza_access_token` cookie
   set at login — wire your `/login` page's success handler to call
   `document.cookie = ...` (httpOnly cookies in production should instead be set
   by a Next.js Route Handler that proxies `/api/auth/login` and forwards
   `Set-Cookie`, so the token never touches `localStorage` for the admin flow).

## Security checklist implemented

- JWT auth with `ADMIN`/`USER` roles enforced by `requireRole` middleware on every mutating CMS/feedback/payments route.
- CORS locked to `FRONTEND_ORIGIN` (supports a comma-separated allowlist for preview deploys).
- `express-rate-limit` backed by Redis, with tighter limits on `/api/auth/*` and `/api/feedback` (POST).
- `helmet()` security headers + explicit HTTPS redirect in production.
- Stripe/Flutterwave webhook signature verification (raw-body HMAC for Stripe, constant-time hash compare for Flutterwave).
- Feedback text is HTML-stripped server-side before storage; new feedback is unapproved until moderated.
- Passwords hashed with bcrypt (cost factor 12); never returned in API responses.

## i18n

`frontend/lib/i18n/en.json` and `rw.json` hold the static UI strings; CMS-driven
copy (hero title/subtitle, banners, announcements) is localized per-row via the
`localized_fields` JSONB column (`{ "en": {...}, "rw": {...} }`), read through
`useLocalizedField()`. The Kinyarwanda strings are a first-pass translation —
have a native speaker review the CMS copy before going live.

## Design tokens

Palette avoids the generic "AI template" defaults on purpose: deep blue
(`ubumwe`, #0F3D5C) and green (`imbuto`, #1F7A4D) carry brand weight, a warm
gold (`sun`, #F2B705) drives every primary CTA, on a cool-neutral `mist`
background (#F3F6F5). Headlines use Plus Jakarta Sans; body text uses Inter.
Full token list in `frontend/tailwind.config.ts`.

## What's stubbed vs. production-ready

Production-ready: auth, RBAC, CMS CRUD + localized fields, feedback submission
and moderation, payment-intent creation and webhook handling for all three
providers, rate limiting, CORS/HTTPS/helmet hardening, the hero banner's
CMS-driven video with poster fallback, and the language switcher.

Intentionally left as integration points for your specific catalog/checkout
UX, since they weren't specified in the brief: the supplies/courses product
grid and detail pages, the client-side Stripe Elements / Flutterwave-hosted
checkout screens, and the `/login` and `/signup` pages themselves (the API
routes they call — `/api/auth/login`, `/api/auth/register` — are complete).

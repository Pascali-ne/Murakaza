-- ============================================================
-- Murakaza — PostgreSQL DDL (Neon serverless)
-- Run via: psql "$DIRECT_URL" -f schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE role AS ENUM ('ADMIN', 'USER');
CREATE TYPE payment_provider AS ENUM ('STRIPE', 'MOMO', 'FLUTTERWAVE');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');
CREATE TYPE content_type AS ENUM ('HERO_VIDEO', 'BANNER_IMAGE', 'THUMBNAIL', 'PAGE_COPY', 'ANNOUNCEMENT');

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name     TEXT NOT NULL,
    role          role NOT NULL DEFAULT 'USER',
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE content_cms (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key              TEXT UNIQUE NOT NULL,
    type             content_type NOT NULL,
    media_url        TEXT,
    poster_url       TEXT,
    localized_fields JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "en": {...}, "rw": {...} }
    is_published     BOOLEAN NOT NULL DEFAULT TRUE,
    updated_by       UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_cms_type ON content_cms(type);

CREATE TABLE payments (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id),
    provider         payment_provider NOT NULL,
    provider_ref     TEXT UNIQUE NOT NULL,
    amount_cents     INTEGER NOT NULL,
    currency         TEXT NOT NULL DEFAULT 'RWF',
    status           payment_status NOT NULL DEFAULT 'PENDING',
    description      TEXT,
    metadata         JSONB,
    webhook_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE feedback (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    author_name TEXT NOT NULL,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    is_hidden   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_feedback_visibility ON feedback(is_approved, is_hidden);

-- Seed: one admin user (replace hash with a real bcrypt hash before running)
-- INSERT INTO users (email, password_hash, full_name, role)
-- VALUES ('admin@murakaza.rw', '$2b$12$REPLACE_ME', 'Murakaza Admin', 'ADMIN');

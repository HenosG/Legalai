# Phase 1: Tools and Signups Checklist

Use this checklist to prepare your production stack accounts before implementing auth, billing, and AI routes.

## 1) Local software to install

- Node.js 20+ and npm
- Git
- Prisma CLI (installed in `apps/api` via npm)
- Optional now, required later:
  - Stripe CLI
  - Railway CLI
  - Vercel CLI

Quick verify commands:

```bash
node -v
npm -v
git --version
```

## 2) Accounts to create (in this order)

1. GitHub (repo + branch protection)
2. Neon (Postgres database)
3. Clerk (authentication)
4. Stripe (products, prices, webhooks)
5. OpenAI or OpenRouter (AI provider key)
6. Resend (transactional email)
7. Railway (backend deploy target)
8. Vercel (frontend deploy target)

## 3) Environment variables you will need

### API (`apps/api/.env`)

- `NODE_ENV`
- `PORT`
- `DATABASE_URL` (from Neon)
- `CORS_ORIGIN` (frontend URL)

### Upcoming vars for next phases

- Clerk:
  - `CLERK_PUBLISHABLE_KEY` (frontend)
  - `CLERK_SECRET_KEY` (backend)
  - `CLERK_JWT_ISSUER` (backend verification config)
- Stripe:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_ID_*` (per plan/cycle)
- AI:
  - `AI_API_KEY`
  - `AI_GATEWAY_URL`
  - `AI_MODEL`
- Resend:
  - `RESEND_API_KEY`
  - `EMAIL_FROM`

## 4) Neon setup notes

1. Create a project and database.
2. Copy pooled connection string (`DATABASE_URL`).
3. Keep SSL enabled (`sslmode=require`).
4. Add `DATABASE_URL` to `apps/api/.env`.

## 5) Immediate next command sequence

From `apps/api`:

```bash
cp .env.example .env
# then set DATABASE_URL from Neon
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

Health check:

- `GET http://localhost:5000/`
- `GET http://localhost:5000/health`

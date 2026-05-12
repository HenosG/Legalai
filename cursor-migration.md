# Cursor Migration Guide

## Current Migration Status

- Lovable dependencies removed.
- Supabase frontend/backend code removed.
- New API scaffold added at `apps/api` (Express + TypeScript + Prisma).
- Frontend now points to `VITE_API_BASE_URL` for new backend integration.

## Active Stack

- Frontend: Vite + React + TypeScript + Tailwind + shadcn/ui
- Backend: Node.js + Express + Prisma
- Database: Neon Postgres
- Auth: Clerk (next integration step)
- Billing: Stripe (next integration step)
- AI: OpenRouter/OpenAI via backend (next integration step)

## Local Run

1. Frontend:
```bash
npm run dev
```

2. API:
```bash
npm run dev:api
```

## Environment

Frontend `.env`:

- `VITE_API_BASE_URL`
- `VITE_CLERK_PUBLISHABLE_KEY`

Backend `apps/api/.env`:

- `DATABASE_URL`
- `PORT`
- `CORS_ORIGIN`
- `CLERK_SECRET_KEY` (coming next)
- `STRIPE_SECRET_KEY` (coming next)
- `STRIPE_WEBHOOK_SECRET` (coming next)
- `AI_API_KEY` / `AI_GATEWAY_URL` / `AI_MODEL` (coming next)

## Next Build Steps

1. Connect Neon and run first Prisma migration.
2. Integrate Clerk auth in frontend and API middleware.
3. Build Stripe checkout + webhook routes in `apps/api`.
4. Move legal chat to `apps/api/ai/chat` streaming endpoint.

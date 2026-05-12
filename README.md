# Reluno Legal AI

Local-first setup and development guide for this repository.

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Express API + Prisma + Neon Postgres
- Stripe (subscription billing)

## Prerequisites

- Node.js 20+
- npm
- `apps/api` dependencies (`npm install` in `apps/api`)
- Stripe CLI (for local billing webhook testing)

## Quick start (frontend only)

1. Install dependencies:

```sh
npm install
```

2. Create local env file from template:

```sh
cp .env.example .env.local
```

3. Fill in the values in `.env.local`:

- `VITE_API_BASE_URL`
- `VITE_CLERK_PUBLISHABLE_KEY`

4. Start the frontend:

```sh
npm run dev
```

## Local backend (Express)

From the project root:

```sh
npm run dev:api
```

## Local billing webhook (Stripe)

Forward events to local API webhook route:

```sh
stripe listen --forward-to http://localhost:5000/stripe/webhook
```

## Environment and secrets

- Keep local app vars in `.env.local` (not committed).
- Keep only templates in git (`.env.example`).
- Set API environment variables in your backend deployment/local `.env`:

```sh
DATABASE_URL=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
CLERK_SECRET_KEY=...
AI_API_KEY=...
```

# Ecommerce Admin Dashboard

Next.js admin dashboard for the ecommerce API.

## Stack

- Next.js App Router + TypeScript + Tailwind
- shadcn/ui
- TanStack Query and TanStack Table
- React Hook Form + Zod
- axios

## Run locally

The API should already be running on `http://localhost:8000`.

```bash
npm install
npm run dev
```

The dashboard starts on [http://localhost:3001](http://localhost:3001).

Copy `.env.example` to `.env.local` if you need a different API URL:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Sign in with an account whose `role` is `admin`.

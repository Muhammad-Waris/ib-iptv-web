# IPTV Web Frontend

---

## 🏗️ Project Architecture & Deployment Summary

### 1. Backend (Brain)

| Detail     | Value                                                      |
| ---------- | ---------------------------------------------------------- |
| Technology | NestJS (Node.js) with TypeORM / Prisma                     |
| Host       | DigitalOcean App Platform (`lobster-app`)                   |
| Region     | Bangalore (BLR1)                                            |
| Live URL   | `https://lobster-app-difq8.ondigitalocean.app`              |
| Port       | 3000 (Internal & Public)                                    |

Key Logic: Uses `DATABASE_URL` for production, falls back to local settings for development.

### 2. Database (Memory)

| Detail            | Value                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| Technology        | PostgreSQL on **Supabase**                                                                                |
| Connection Method | IPv4 Connection Pooler (Port 6543)                                                                        |
| Connection String | `postgresql://postgres.[ID]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true` |

> **Why Port 6543?** Fixed the `EHOSTUNREACH` error by providing a stable IPv4 route from DigitalOcean to Supabase.

### 3. Frontend Website (Face)

| Detail               | Value                                          |
| -------------------- | ---------------------------------------------- |
| Technology           | Next.js (App Router, TypeScript, Tailwind CSS)  |
| Host                 | **Vercel**                                      |
| Domain               | Vercel-managed custom domain                   |
| Environment Variable | `NEXT_PUBLIC_API_URL` → DigitalOcean backend URL |

### 4. Mobile App (Hands)

| Detail         | Value                                              |
| -------------- | -------------------------------------------------- |
| Technology     | **Flutter**                                         |
| Production URL | `https://lobster-app-difq8.ondigitalocean.app`      |
| Optimizations  | HTTPS enforced, 10s timeout, split-ABI APKs         |

---

## Getting Started (Local Development)

```bash
npm install
npm run dev
```

The dev server starts on [http://localhost:3001](http://localhost:3001). API requests are proxied to `http://localhost:3000` via Next.js rewrites (see `next.config.ts`).

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production (Vercel), set `NEXT_PUBLIC_API_URL` to the DigitalOcean backend URL.

---

## Project Structure

```
app/                  # Next.js App Router pages
  layout.tsx          # Root layout (dark theme)
  page.tsx            # Homepage with hero, trust sections, and pricing
  activate-device/    # Device login (MAC + key)
  dashboard/          # Subscription status, playlist, plan cards
  manage-playlist/    # Add/edit M3U or Xtream Codes playlist
  download/           # App download + installation guides
  checkout/           # Manual plan/contact flow (future-ready for payments)
  how-to-activate/    # Activation instructions
  how-to-add-playlist/# Playlist setup guide
  contact/            # Support contact page
components/           # Reusable UI components
hooks/                # Custom React hooks (useAuth)
lib/                  # API client, auth helpers
types/                # TypeScript type definitions
public/               # Static assets
```

---

## Deployment

- **Frontend:** Auto-deploys to Vercel on push to `main`.
- **Backend:** Auto-deploys to DigitalOcean App Platform on push.
- **Database:** Managed by Supabase (no deployment needed).
- **Billing:** Manual support flow for now; online payments can be integrated later.

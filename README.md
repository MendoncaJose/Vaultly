# Vaultly

Portfolio tracker for stocks, ETFs and crypto. Technical MVP — full-stack, secure auth, real market data, dark editorial UI.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript 5 + React Compiler + Vite 6 |
| Styling | Tailwind CSS v4 (custom design tokens) |
| State | TanStack Query v5 + React Hook Form v7 + Zod v4 |
| Backend | Express 5 + TypeScript 6 + tsx (no compile in dev) |
| ORM | Prisma 7 (prisma.config.ts) |
| Database | PostgreSQL 16 (Docker) |
| Auth | JWT access token (memory) + refresh token (httpOnly cookie, stored as SHA-256 hash) |
| Market data | Finnhub — quotes cached 5 min (`PriceSnapshot`) |
| FX rates | Frankfurter — EUR/USD cached daily (`FxRateSnapshot`) |
| Alerts | node-cron — daily at 23:00 Europe/Lisbon |

---

## Repository structure

```
vaultly/
├── frontend/          React app (port 5173)
├── backend/           Express API (port 4000)
├── shared/            Zod schemas shared by frontend + backend
├── prisma/            schema.prisma + migrations
└── docker-compose.yml PostgreSQL 16 on port 5433
```

---

## Prerequisites

- Node.js 20+
- Docker Desktop

---

## Setup

### 1. Install dependencies

```bash
npm install
```

This installs all workspaces (root, frontend, backend, shared).

### 2. Start PostgreSQL

```bash
docker compose up -d
```

Starts PostgreSQL 16 on **port 5433** (5432 left free for local installs).

### 3. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` — minimum required:

```env
PORT=4000
DATABASE_URL=postgresql://vaultly:vaultly_password@localhost:5433/vaultly?schema=public
JWT_ACCESS_SECRET=<at_least_32_chars>
JWT_REFRESH_SECRET=<at_least_32_chars>
CORS_ORIGIN=http://localhost:5173
FINNHUB_API_KEY=<your_key>
```

Get a free Finnhub API key at [finnhub.io](https://finnhub.io).

### 4. Run database migrations

```bash
cd backend
npx prisma migrate deploy
```

### 5. Start dev servers

Backend (from `backend/`):

```bash
npm run dev
```

Frontend (from `frontend/`):

```bash
npm run dev
```

Or run both from the root:

```bash
npm run dev
```

---

## Environment variables

All variables are validated at startup with Zod. The server will refuse to start if any required variable is missing or malformed.

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | no | `4000` | HTTP port |
| `NODE_ENV` | no | `development` | `development` \| `production` |
| `DATABASE_URL` | yes | — | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | yes | — | Secret for access tokens (min 16 chars) |
| `JWT_REFRESH_SECRET` | yes | — | Secret for refresh tokens (min 16 chars) |
| `ACCESS_TOKEN_EXPIRES_IN` | no | `15m` | Access token TTL |
| `REFRESH_TOKEN_EXPIRES_IN` | no | `7d` | Refresh token TTL |
| `CORS_ORIGIN` | yes | — | Frontend origin (`http://localhost:5173`) |
| `FINNHUB_API_KEY` | yes | — | Finnhub API key |
| `MARKET_DATA_CACHE_TTL_SECONDS` | no | `300` | Quote cache TTL |
| `FX_RATE_CACHE_TTL_SECONDS` | no | `86400` | FX rate cache TTL |
| `FX_PROVIDER` | no | `FRANKFURTER` | FX provider |
| `BASE_CURRENCY_DEFAULT` | no | `EUR` | Default portfolio currency |
| `ALERT_CRON_SCHEDULE` | no | `0 23 * * *` | Cron expression for alert checks |
| `ALERT_CRON_TIMEZONE` | no | `Europe/Lisbon` | Timezone for cron |
| `BCRYPT_ROUNDS` | no | `12` | bcrypt work factor (10–14) |

---

## Architecture

### Auth flow

```
Register/Login → access token (JWT, 15m, in memory)
             → refresh token (JWT, 7d, httpOnly cookie path=/auth)
             → refresh token hash stored in DB (SHA-256)

POST /auth/refresh → rotates refresh token (old deleted, new issued)
POST /auth/logout  → deletes token hash from DB, clears cookie
```

Access token is never stored in `localStorage` or cookies — lives only in module-level memory on the frontend, reset via `POST /auth/refresh` on app mount.

### Data flow

```
Frontend → backend API (Express)
         → market-data.service (Finnhub, cached in PriceSnapshot)
         → fx.service (Frankfurter, cached in FxRateSnapshot)
         → Prisma → PostgreSQL
```

Frontend never calls Finnhub or Frankfurter directly. All API keys are backend-only.

### Holdings model

- `Transaction` — immutable history (BUY/SELL with fee)
- `Holding` — current snapshot, derived from transactions
  - `quantity`, `averageBuyPrice` (fee-inclusive cost basis)
  - Status: `OPEN` | `CLOSED` (closed when quantity reaches 0)
- Users never create holdings manually — only via buy/sell transactions

### Cost basis

```
BUY:  netAmount = quantity × price + fee
SELL: netAmount = quantity × price - fee
averageBuyPrice = totalCost / totalQuantity (fee-inclusive, weighted average)
```

### Alert cron

Runs at 23:00 Europe/Lisbon daily. Deduplicates symbols, fetches quotes in batch, evaluates `PRICE_ABOVE` / `PRICE_BELOW` / `DAILY_CHANGE_PERCENT` conditions. Creates `Notification` + marks alert triggered.

---

## Technical decisions

| Decision | Reason |
|---|---|
| Docker port 5433 | Avoids conflict with local PostgreSQL on 5432 |
| `prisma.config.ts` | Prisma 7 config file, not `schema.prisma` env block |
| `tsx` for backend dev | No compile step; TypeScript 6 + ESM |
| Access token in memory | Not vulnerable to XSS (no localStorage/cookie) |
| Refresh token as hash | Raw token never stored; SHA-256 hash only |
| `z.coerce.number()` + Resolver cast | RHF v7 + Zod v4 type conflict workaround |
| `rootDir: ".."` in backend tsconfig | Allows importing `../shared` across workspace |
| `ignoreDeprecations: "6.0"` | TypeScript 6 requires this for `moduleResolution: Node` |

---

## Useful commands

```bash
# Typecheck frontend
cd frontend && npx tsc --noEmit

# Typecheck backend
cd backend && npx tsc --noEmit

# Prisma studio
cd backend && npx prisma studio

# Generate Prisma client
cd backend && npx prisma generate

# Run migrations
cd backend && npx prisma migrate deploy
```

---

## Disclaimer

Vaultly is a personal portfolio tracking tool for informational purposes only. Nothing displayed constitutes financial advice, investment recommendations, or a solicitation to buy or sell any security or digital asset. Market data provided by Finnhub. Exchange rates by Frankfurter. Prices may be delayed. Past performance does not guarantee future results.

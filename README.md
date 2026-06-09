# Vaultly

Portfolio tracker for stocks, ETFs and crypto. Technical MVP with full-stack architecture, secure auth, real market data integration, and premium dark UI.

## Stack

- **Frontend:** React 19 + TypeScript + React Compiler + Tailwind v4 + Vite
- **Backend:** Node.js + Express 5 + TypeScript + Prisma 7
- **Database:** PostgreSQL (Docker)
- **Market data:** Finnhub
- **FX rates:** Frankfurter (EUR/USD)

## Structure

```
vaultly/
├── frontend/        React app (port 5173)
├── backend/         Express API (port 4000)
├── shared/          Shared enums, types, schemas
├── prisma/          Database schema and migrations
└── docker-compose.yml
```

## Setup

> Full setup instructions will be added when the project is complete.

### Prerequisites

- Node.js 20+
- Docker Desktop

### Quick start (once setup is complete)

```bash
# Start database
docker compose up -d

# Install dependencies
npm install

# Start dev servers
npm run dev
```

## Docs

- [`DESIGN.md`](DESIGN.md) — product, architecture, API, design rules (source of truth)
- [`TASKS.md`](TASKS.md) — implementation plan

## Disclaimer

Vaultly provides portfolio tracking and market data visualization only. It does not provide financial advice. Prices may be delayed depending on the data provider.

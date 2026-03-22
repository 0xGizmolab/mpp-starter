# MPP Example: Koa

Koa 3.1.2 with manual MPP middleware.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Test: `npx mppx http://localhost:3005/paid`

## Endpoints

- `GET /health` — Health check
- `GET /free` — Free endpoint  
- `GET /paid` — Payment-gated endpoint

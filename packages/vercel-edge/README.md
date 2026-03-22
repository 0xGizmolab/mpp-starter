# MPP Example: Vercel Edge Functions

Vercel Edge Functions with MPP payment gating.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Deploy: `pnpm deploy`

## Endpoints

- `GET /api/health` — Health check
- `GET /api/free` — Free endpoint  
- `GET /api/paid` — Payment-gated endpoint

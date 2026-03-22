# MPP Example: Cloudflare Workers

Cloudflare Workers with MPP payment gating.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Deploy: `pnpm deploy`

## Endpoints

- `GET /health` — Health check
- `GET /free` — Free endpoint  
- `GET /paid` — Payment-gated endpoint

# MPP Example: Fastify

Fastify 5.8.2 with manual MPP integration using preHandler hooks.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Test: `npx mppx http://localhost:3004/paid`

## Endpoints

- `GET /health` — Health check
- `GET /free` — Free endpoint  
- `GET /paid` — Payment-gated endpoint

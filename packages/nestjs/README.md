# MPP Example: NestJS

NestJS 11.1.17 with MPP Guard for payment authorization.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Test: `npx mppx http://localhost:3006/paid`

## Endpoints

- `GET /health` — Health check
- `GET /free` — Free endpoint  
- `GET /paid` — Payment-gated endpoint (uses MppGuard)

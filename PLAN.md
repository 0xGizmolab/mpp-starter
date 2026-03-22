# MPP Examples Monorepo - Build Plan

## Overview
Build example apps for 11 JS frameworks/runtimes with MPP (Machine Payments Protocol) integration.
Each app demonstrates payment-gated API endpoints using the mppx SDK.

## Categories

### Server Frameworks (7)
| Framework | Version | MPP Support |
|-----------|---------|-------------|
| Next.js | 16.2 | Official middleware |
| Hono | 4.12.8 | Official middleware |
| Elysia | 1.4.28 | Official middleware |
| Express | 5.2.1 | Official middleware |
| Fastify | 5.8.2 | Manual (Fetch API) |
| Koa | 3.1.2 | Manual (Node listener) |
| NestJS | 11.1.17 | Manual (Fetch API) |

### Serverless / Edge (4)
| Platform | Runtime | Notes |
|----------|---------|-------|
| Cloudflare Workers | Hono | Edge, global |
| Vercel Edge | Next.js Edge Runtime | Edge functions |
| AWS Lambda | Node.js + Serverless | Classic serverless |
| Deno Deploy | Hono/Fresh | Deno runtime |

## Test Framework
- Vitest (modern, fast, TypeScript-first)

## MPP Configuration

**⚠️ NO SHARED CONFIG** — Each app has its OWN config file.

Each app includes:
- `src/mpp-config.ts` — Local config loader
- `.env.example` — Environment template with defaults

### Default Values (in each .env.example)
```env
# MPP Configuration
MPP_RECIPIENT=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
MPP_CURRENCY=0x20c0000000000000000000000000000000000000
MPP_AMOUNT=0.01
MPP_MODE=pull
MPP_WAIT_FOR_CONFIRMATION=true
```

### Config Loader Pattern (each app)
```typescript
// src/mpp-config.ts
export const mppConfig = {
  recipient: process.env.MPP_RECIPIENT ?? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  currency: process.env.MPP_CURRENCY ?? '0x20c0000000000000000000000000000000000000',
  amount: process.env.MPP_AMOUNT ?? '0.01',
  mode: (process.env.MPP_MODE ?? 'pull') as 'pull' | 'push',
  waitForConfirmation: process.env.MPP_WAIT_FOR_CONFIRMATION !== 'false',
}
```

## Structure
```
mpp-examples/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── vitest.workspace.ts
│
├── packages/
│   │
│   │── # Server Frameworks
│   ├── nextjs/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── src/mpp-config.ts
│   │   ├── app/api/health/route.ts
│   │   ├── app/api/free/route.ts
│   │   ├── app/api/paid/route.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   │
│   ├── hono/
│   ├── elysia/
│   ├── express/
│   ├── fastify/
│   ├── koa/
│   ├── nestjs/
│   │
│   │── # Serverless / Edge
│   ├── cloudflare-workers/
│   │   ├── package.json
│   │   ├── wrangler.toml
│   │   ├── .env.example
│   │   ├── src/mpp-config.ts
│   │   ├── src/index.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   │
│   ├── vercel-edge/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── src/mpp-config.ts
│   │   ├── api/health.ts
│   │   ├── api/free.ts
│   │   ├── api/paid.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   │
│   ├── aws-lambda/
│   │   ├── package.json
│   │   ├── serverless.yml
│   │   ├── .env.example
│   │   ├── src/mpp-config.ts
│   │   ├── src/handlers/health.ts
│   │   ├── src/handlers/free.ts
│   │   ├── src/handlers/paid.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   │
│   └── deno-deploy/
│       ├── deno.json
│       ├── .env.example
│       ├── src/mpp-config.ts
│       ├── src/main.ts
│       ├── __tests__/api.test.ts
│       └── README.md
```

## Build Order

### Phase 1: Setup
- [ ] Initialize pnpm workspace
- [ ] Set up vitest workspace config
- [ ] Create root package.json with scripts

### Phase 2: Server Frameworks - Official Middleware
- [x] 1. Next.js 16.2 — mppx/nextjs
- [x] 2. Hono 4.12.8 — mppx/hono
- [x] 3. Elysia 1.4.28 — mppx/elysia
- [ ] 4. Express 5.2.1 — mppx/express

### Phase 3: Server Frameworks - Manual Integration
- [ ] 5. Fastify 5.8.2 — mppx/server + Fastify adapter
- [ ] 6. Koa 3.1.2 — mppx/server + Node listener
- [ ] 7. NestJS 11.1.17 — mppx/server + interceptor

### Phase 4: Serverless / Edge
- [ ] 8. Cloudflare Workers — Hono + mppx
- [ ] 9. Vercel Edge — Edge runtime + mppx
- [ ] 10. AWS Lambda — Serverless + mppx
- [ ] 11. Deno Deploy — Hono + mppx

### Phase 5: Testing & Polish
- [ ] Run all tests (`pnpm test`)
- [ ] Fix any failures
- [ ] Write root README with overview
- [ ] Final commit

## API Spec (all apps)

### GET /health
```json
{ "status": "ok", "framework": "nextjs", "version": "16.2" }
```

### GET /free
```json
{ "message": "This is free!", "timestamp": 1711152000000 }
```

### GET /paid
Without payment:
- Status: 402
- Header: `WWW-Authenticate: MPP ...`

With valid payment:
```json
{ "message": "Premium content unlocked!", "timestamp": 1711152000000 }
```

## Test Cases (Vitest)

1. `GET /health` → 200 with framework info
2. `GET /free` → 200 with message
3. `GET /paid` → 402 without credentials
4. `GET /paid` → 200 with mocked valid credentials

## Per-Package README Template

```markdown
# MPP Example: {Framework}

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment config:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your MPP settings

4. Run the server:
   ```bash
   pnpm dev
   ```

5. Test with mppx CLI:
   ```bash
   npx mppx http://localhost:3000/paid
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| MPP_RECIPIENT | 0xf39... | Wallet to receive payments |
| MPP_CURRENCY | 0x20c... | Token address (pathUSD) |
| MPP_AMOUNT | 0.01 | Charge amount |
| MPP_MODE | pull | pull or push |
| MPP_WAIT_FOR_CONFIRMATION | true | Wait for on-chain confirm |

## Endpoints

- `GET /health` — Health check
- `GET /free` — Free endpoint
- `GET /paid` — Payment-gated endpoint

## Running Tests

```bash
pnpm test
```
```

---

**Goal:** All 11 examples built, tested, documented within 4 hours.

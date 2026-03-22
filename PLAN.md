# MPP Examples Monorepo - Build Plan

## Overview
Build example apps for 7 JS frameworks with MPP (Machine Payments Protocol) integration.
Each app demonstrates payment-gated API endpoints using the mppx SDK.

## Framework Versions
- Next.js: 16.2
- Hono: 4.12.8
- Elysia: 1.4.28
- Express: 5.2.1
- Fastify: 5.8.2
- Koa: 3.1.2
- NestJS: 11.1.17

## Test Framework
- Vitest (modern, fast, TypeScript-first)

## MPP Configuration (shared)
All apps should read from environment variables:
- `MPP_RECIPIENT` - Wallet address to receive payments
- `MPP_CURRENCY` - Token address (default: pathUSD on Tempo)
- `MPP_AMOUNT` - Default charge amount (e.g., "0.01")
- `MPP_MODE` - pull | push (optional)
- `MPP_WAIT_FOR_CONFIRMATION` - true | false (optional)

## Structure
```
mpp-examples/
├── README.md                    # Overview + quick start
├── package.json                 # Workspace root
├── pnpm-workspace.yaml
├── vitest.workspace.ts          # Shared vitest config
├── shared/
│   └── mpp-config.ts            # Shared config loader
├── packages/
│   ├── nextjs/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── app/api/paid/route.ts
│   │   ├── app/api/free/route.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   ├── hono/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── src/index.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   ├── elysia/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── src/index.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   ├── express/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── src/index.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   ├── fastify/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── src/index.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   ├── koa/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── src/index.ts
│   │   ├── __tests__/api.test.ts
│   │   └── README.md
│   └── nestjs/
│       ├── package.json
│       ├── .env.example
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   └── paid/paid.controller.ts
│       ├── __tests__/api.test.ts
│       └── README.md
```

## Build Order (one by one)

### Phase 1: Setup
- [ ] Initialize pnpm workspace
- [ ] Create shared config loader
- [ ] Set up vitest workspace

### Phase 2: Official Middleware (easier)
- [ ] 1. Next.js - mppx/nextjs middleware
- [ ] 2. Hono - mppx/hono middleware  
- [ ] 3. Elysia - mppx/elysia middleware
- [ ] 4. Express - mppx/express middleware

### Phase 3: Manual Integration (Fetch API)
- [ ] 5. Fastify - mppx/server with Fetch adapter
- [ ] 6. Koa - mppx/server with Node listener
- [ ] 7. NestJS - mppx/server with custom interceptor

### Phase 4: Testing & Polish
- [ ] Run all tests
- [ ] Fix any failures
- [ ] Write root README
- [ ] Final review

## API Spec (each app)

### GET /free
Returns: `{ message: "This is free!", timestamp: ... }`

### GET /paid
- Returns 402 with WWW-Authenticate challenge if no payment
- Returns `{ message: "Premium content!", timestamp: ... }` with receipt after payment

### GET /health
Returns: `{ status: "ok", framework: "..." }`

## Test Cases (Vitest)

1. `GET /health` returns 200
2. `GET /free` returns 200 with message
3. `GET /paid` returns 402 without credentials
4. `GET /paid` returns 200 with valid credentials (mock)

## Documentation

Each package README:
- Quick start
- Environment variables
- How to test with mppx CLI
- Code walkthrough

Root README:
- Project overview
- MPP explanation
- How to run all examples
- How to run tests

## Notes

- Use TypeScript everywhere
- Use ESM modules
- Pin exact framework versions
- Include tsconfig.json per package
- Test with `pnpm test` at root

---

**Goal:** All 7 examples built, tested, documented within 4 hours.

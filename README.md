# MPP Examples Monorepo

Example apps demonstrating **Machine Payments Protocol (MPP)** integration across 11 JavaScript frameworks and runtimes.

## What is MPP?

MPP (Machine Payments Protocol) enables **payment-gated APIs** — endpoints that require micropayments before returning content. When a request lacks valid payment credentials, the server responds with HTTP 402 (Payment Required) and a `WWW-Authenticate: MPP ...` header instructing the client how to pay.

## Frameworks Included

### Server Frameworks (7)

| Framework | Version | Port | MPP Integration |
|-----------|---------|------|-----------------|
| [Next.js](./packages/nextjs) | 16.2 | 3000 | `mppx/nextjs` |
| [Hono](./packages/hono) | 4.12.8 | 3001 | `mppx/hono` |
| [Elysia](./packages/elysia) | 1.4.28 | 3002 | `mppx/elysia` |
| [Express](./packages/express) | 5.2.1 | 3003 | `mppx/express` |
| [Fastify](./packages/fastify) | 5.8.2 | 3004 | Manual middleware |
| [Koa](./packages/koa) | 3.1.2 | 3005 | Manual middleware |
| [NestJS](./packages/nestjs) | 11.1.17 | 3006 | Guard |

### Serverless / Edge (4)

| Platform | Description |
|----------|-------------|
| [Cloudflare Workers](./packages/cloudflare-workers) | Edge compute |
| [Vercel Edge](./packages/vercel-edge) | Edge functions |
| [AWS Lambda](./packages/aws-lambda) | Classic serverless |
| [Deno Deploy](./packages/deno-deploy) | Deno runtime |

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/mpp-examples.git
cd mpp-examples
pnpm install

# Run tests for all packages
pnpm test

# Run a specific example
pnpm dev:nextjs   # or dev:hono, dev:elysia, etc.
```

## API Endpoints

Every example exposes the same three endpoints:

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /health` | None | Returns `{ status: "ok", framework: "...", version: "..." }` |
| `GET /free` | None | Returns `{ message: "This is free!", timestamp: ... }` |
| `GET /paid` | MPP | Returns `{ message: "Premium content unlocked!", timestamp: ... }` |

### Testing Payment-Gated Endpoints

```bash
# Without credentials — returns 402
curl http://localhost:3000/api/paid
# HTTP/1.1 402 Payment Required
# WWW-Authenticate: MPP realm="api", method="tempo", params="..."

# With mppx CLI — handles payment automatically
npx mppx http://localhost:3000/api/paid
# { "message": "Premium content unlocked!", "timestamp": 1711152000000 }
```

## Configuration

Each app has its own configuration:

```
packages/
  nextjs/
    src/mpp-config.ts   # Local config loader
    .env.example        # Environment template
  hono/
    src/mpp-config.ts
    .env.example
  ...
```

### Default Environment Variables

```env
# .env.example
MPP_RECIPIENT=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
MPP_CURRENCY=0x20c0000000000000000000000000000000000000
MPP_AMOUNT=0.01
MPP_WAIT_FOR_CONFIRMATION=true
```

| Variable | Description |
|----------|-------------|
| `MPP_RECIPIENT` | Wallet address to receive payments |
| `MPP_CURRENCY` | Token contract address (default: pathUSD) |
| `MPP_AMOUNT` | Charge amount per request |
| `MPP_WAIT_FOR_CONFIRMATION` | Wait for on-chain confirmation |

## Project Structure

```
mpp-examples/
├── package.json              # Workspace config
├── pnpm-workspace.yaml       # pnpm workspace definition
├── vitest.workspace.ts       # Test runner config
├── PLAN.md                   # Build plan & progress
│
└── packages/
    ├── nextjs/               # Next.js 16.2 example
    ├── hono/                 # Hono 4.12.8 example
    ├── elysia/               # Elysia 1.4.28 example
    ├── express/              # Express 5.2.1 example
    ├── fastify/              # Fastify 5.8.2 example
    ├── koa/                  # Koa 3.1.2 example
    ├── nestjs/               # NestJS 11.1.17 example
    ├── cloudflare-workers/   # Cloudflare Workers example
    ├── vercel-edge/          # Vercel Edge Functions example
    ├── aws-lambda/           # AWS Lambda example
    └── deno-deploy/          # Deno Deploy example
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
cd packages/nextjs && pnpm test
```

## How MPP Works

### Without Payment (402 Response)

```http
GET /api/paid HTTP/1.1
Host: localhost:3000

HTTP/1.1 402 Payment Required
WWW-Authenticate: MPP realm="api", method="tempo", params="recipient=0x...,currency=0x...,amount=0.01"
Content-Type: application/json

{"error": "Payment required"}
```

### With Valid Payment

```http
GET /api/paid HTTP/1.1
Host: localhost:3000
Authorization: MPP <payment-proof>

HTTP/1.1 200 OK
Content-Type: application/json

{"message": "Premium content unlocked!", "timestamp": 1711152000000}
```

## Official mppx Middleware

For frameworks with official support, integration is simple:

```typescript
// Next.js example
import { Mppx, tempo } from 'mppx/nextjs'

const mppx = Mppx.create({
  methods: [tempo({ recipient: '0x...', currency: '0x...', decimals: 6 })],
})

export const GET = mppx.charge({ amount: '0.01' })(() =>
  Response.json({ message: 'Premium content unlocked!' })
)
```

## Manual Integration

For frameworks without official middleware, implement the auth check manually:

```typescript
// Express example
app.get('/paid', (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('MPP ')) {
    res.status(402)
       .set('WWW-Authenticate', 'MPP realm="api", method="tempo", params="..."')
       .send()
    return
  }
  next()
}, (req, res) => {
  res.json({ message: 'Premium content unlocked!' })
})
```

## Learn More

- [MPP Documentation](https://mpp.dev/docs)
- [mppx SDK](https://github.com/mppx/mppx)
- [MPP Protocol Spec](https://mpp.dev/spec)

## License

MIT

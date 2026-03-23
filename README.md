# MPP Examples — Machine Payments Protocol Starter Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MPP](https://img.shields.io/badge/MPP-HTTP%20402-green.svg)](https://mpp.dev)
[![Tempo](https://img.shields.io/badge/Tempo-Stablecoins-purple.svg)](https://tempo.xyz)
[![Stripe](https://img.shields.io/badge/Stripe-Cards-blue.svg)](https://stripe.com)

Production-ready examples for integrating **payment-gated APIs** using the Machine Payments Protocol (MPP) across **11 JavaScript frameworks**.

> **MPP** is the open standard for machine-to-machine payments via HTTP 402 — co-developed by [Tempo Labs](https://tempo.xyz) and [Stripe](https://stripe.com).

## 🌐 What is MPP?

The **Machine Payments Protocol** enables APIs to charge for access in the same HTTP request — no API keys, no subscriptions, no billing accounts. When a client requests a protected resource:

1. **Server returns `402 Payment Required`** with payment options
2. **Client pays** (stablecoins, cards, or Bitcoin)
3. **Client retries** with payment proof
4. **Server delivers** the resource with a receipt

```
Client ──GET /resource──▶ Server
       ◀──402 + Challenge──
       ──pays via Tempo/Stripe──
       ──GET + Credential──▶
       ◀──200 + Receipt──
```

### Why MPP?

| Problem | MPP Solution |
|---------|--------------|
| API keys leak and get abused | Pay per request — no keys needed |
| Subscriptions waste money on unused quota | Pay only for what you use |
| Billing disputes and chargebacks | Cryptographic receipts prove delivery |
| Agent onboarding friction | Zero signup — just pay and go |

---

## ⚡ Who Built This?

MPP was co-developed by:

- **[Tempo Labs](https://tempo.xyz)** — Built the Tempo blockchain for stablecoin payments at scale. Incubated by Paradigm and Stripe.
- **[Stripe](https://stripe.com)** — Card payments integration via Shared Payment Tokens.
- **[Wevm](https://wevm.dev)** — Maintains the official `mppx` SDK.

The protocol is submitted to the **IETF** for standardization: [paymentauth.org](https://paymentauth.org)

---

## 💳 Payment Methods

MPP supports multiple payment rails:

| Method | Description | Use Case |
|--------|-------------|----------|
| **[Tempo](https://mpp.dev/payment-methods/tempo)** | Stablecoin payments (USDC, pathUSD) on Tempo blockchain | High-frequency API calls, AI agents |
| **[Stripe](https://mpp.dev/payment-methods/stripe)** | Cards, Apple Pay, Google Pay via Shared Payment Tokens | Traditional payments, web apps |
| **[Lightning](https://mpp.dev/payment-methods/lightning)** | Bitcoin over Lightning Network (BOLT11) | Crypto-native apps |
| **Custom** | Build your own payment method | Any payment rail |

### Payment Intents

| Intent | Description | Latency | Cost |
|--------|-------------|---------|------|
| **Charge** | One-time payment per request | ~600ms (on-chain) | Per-tx fees |
| **Session** | Pay-as-you-go via payment channels | ~10ms (off-chain) | Near-zero |

**Sessions** enable streaming payments for LLM APIs — pay per token with microsecond verification.

---

## 🔗 The Tempo Blockchain

[Tempo](https://tempo.xyz) is a purpose-built blockchain for stablecoin payments:

- **~0.6s finality** — Deterministic settlement, no re-orgs
- **Stablecoin-native gas** — Pay fees in USD, not volatile tokens
- **Payment lanes** — Guaranteed blockspace for payments
- **Payment channels** — Off-chain sessions for high-throughput billing
- **Smart accounts** — Passkey auth, batch transactions, gas sponsorship

### Supported Currencies

| Token | Address | Description |
|-------|---------|-------------|
| pathUSD | `0x20c0...0000` | Tempo's native USD stablecoin |
| USDC | Bridge address | Circle's USDC (bridged) |

---

## 🛠 Framework Examples

### Server Frameworks (7)

| Framework | Version | Port | Integration | Middleware |
|-----------|---------|------|-------------|------------|
| [Next.js](./packages/nextjs) | 16.2 | 3000 | Official | `mppx/nextjs` |
| [Hono](./packages/hono) | 4.12.8 | 3001 | Official | `mppx/hono` |
| [Elysia](./packages/elysia) | 1.4.28 | 3002 | Official | `mppx/elysia` |
| [Express](./packages/express) | 5.2.1 | 3003 | Official | `mppx/express` |
| [Fastify](./packages/fastify) | 5.8.2 | 3004 | Manual | Custom preHandler |
| [Koa](./packages/koa) | 3.1.2 | 3005 | Manual | Custom middleware |
| [NestJS](./packages/nestjs) | 11.1.17 | 3006 | Manual | Guard |

### Session Example (Pay-as-you-go)

| Framework | Version | Port | Description |
|-----------|---------|------|-------------|
| [Hono Session](./packages/hono-session) | 4.12.8 | 3008 | Payment channels for high-throughput billing |

### Serverless / Edge (4)

| Platform | Description | Deployment |
|----------|-------------|------------|
| [Cloudflare Workers](./packages/cloudflare-workers) | Edge compute | `wrangler deploy` |
| [Vercel Edge](./packages/vercel-edge) | Edge functions | `vercel --prod` |
| [AWS Lambda](./packages/aws-lambda) | Classic serverless | SAM/CDK |
| [Deno Deploy](./packages/deno-deploy) | Deno runtime | `deployctl` |

---

## 🚀 Quick Start

### 1. Get a Tempo Wallet (for paying)

**Option A: No-code (Browser)**
1. Go to [wallet.tempo.xyz](https://wallet.tempo.xyz/welcome)
2. Create wallet with passkey (Face ID / fingerprint)
3. Fund with testnet tokens
4. Done — use the web wallet to pay for APIs

**Option B: CLI (for developers/agents)**
```bash
# Install the Tempo CLI
curl -L https://tempo.xyz/install | bash

# Create a wallet (opens browser for passkey auth)
tempo wallet login

# Fund your wallet with testnet tokens
tempo wallet fund

# Check your balance
tempo wallet balance
```

### 2. Clone & Run Examples

```bash
# Clone the repo
git clone https://github.com/0xGizmolab/mpp-starter.git
cd mpp-starter

# Install dependencies
pnpm install

# Run all tests
pnpm test

# Start a specific example
pnpm dev:nextjs   # or dev:hono, dev:elysia, etc.
```

### 3. Test Payment Flow

```bash
# Without payment — returns 402
curl http://localhost:3000/api/paid
# → 402 Payment Required + WWW-Authenticate header

# With Tempo CLI — handles payment automatically
tempo request http://localhost:3000/api/paid
# → { "message": "Premium content unlocked!" }

# Preview cost without paying
tempo request --dry-run http://localhost:3000/api/paid
```

### Alternative: Use npx (no install)

```bash
# Create account and make paid request
npx mppx account create
npx mppx http://localhost:3000/api/paid
```

---

## 📡 API Endpoints

Every example exposes the same three endpoints:

| Endpoint | Auth | Response |
|----------|------|----------|
| `GET /health` | None | `{ status: "ok", framework: "...", version: "..." }` |
| `GET /free` | None | `{ message: "This is free!", timestamp: ... }` |
| `GET /paid` | MPP | `{ message: "Premium content unlocked!", timestamp: ... }` |

---

## 🔧 Configuration

Each package has its own `mpp-config.ts` and `.env.example`:

```typescript
// packages/*/src/mpp-config.ts
export const mppConfig = {
  recipient: process.env.MPP_RECIPIENT || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  currency: process.env.MPP_CURRENCY || '0x20c0000000000000000000000000000000000000',
  amount: process.env.MPP_AMOUNT || '0.01',
  waitForConfirmation: process.env.MPP_WAIT_FOR_CONFIRMATION !== 'false',
}
```

| Variable | Description | Default |
|----------|-------------|---------|
| `MPP_RECIPIENT` | Your wallet address | Test wallet |
| `MPP_CURRENCY` | Token contract (pathUSD) | Tempo pathUSD |
| `MPP_AMOUNT` | Charge per request | 0.01 |
| `MPP_WAIT_FOR_CONFIRMATION` | Wait for on-chain finality | true |

---

## 📦 Integration Examples

### Official Middleware (Next.js, Hono, Elysia, Express)

```typescript
import { Mppx, tempo } from 'mppx/nextjs'

const mppx = Mppx.create({
  methods: [
    tempo({
      recipient: '0xYourWallet...',
      currency: '0x20c0000000000000000000000000000000000000',
      decimals: 6,
    }),
  ],
})

// Protect any route with a single wrapper
export const GET = mppx.charge({ amount: '0.01' })(() =>
  Response.json({ message: 'Premium content!' })
)
```

### Manual Integration (Fastify, Koa, NestJS)

```typescript
// Fastify preHandler example
app.get('/paid', {
  preHandler: async (request, reply) => {
    const auth = request.headers.authorization
    if (!auth?.startsWith('MPP ')) {
      reply.code(402).header(
        'WWW-Authenticate',
        `MPP realm="api", method="tempo", params="recipient=${config.recipient},..."`
      ).send({ error: 'Payment required' })
    }
  },
}, async () => ({ message: 'Premium content!' }))
```

### Stripe Integration

```typescript
import Stripe from 'stripe'
import { Mppx, stripe } from 'mppx/server'

const mppx = Mppx.create({
  methods: [
    stripe.charge({
      client: new Stripe(process.env.STRIPE_SECRET_KEY!),
      paymentMethodTypes: ['card'],
    }),
  ],
})
```

### Session-Based Billing (Pay-as-you-go)

```typescript
import { Mppx, tempo } from 'mppx/server'

const mppx = Mppx.create({
  methods: [
    tempo.session({
      recipient: '0xYourWallet...',
      currency: '0x20c0...',
    }),
  ],
})

// Client opens a payment channel, signs vouchers per request
// Server verifies in microseconds — no on-chain calls
```

---

## 🌍 MPP Services Ecosystem

30+ services already accept MPP payments:

| Service | Category | Description |
|---------|----------|-------------|
| [OpenAI](https://openai.mpp.tempo.xyz) | AI | GPT-4, embeddings, DALL-E |
| [Anthropic](https://anthropic.mpp.tempo.xyz) | AI | Claude Sonnet, Opus, Haiku |
| [Google Gemini](https://gemini.mpp.tempo.xyz) | AI | Gemini, Veo video, image gen |
| [fal.ai](https://fal.mpp.tempo.xyz) | Media | 600+ image/video models |
| [Firecrawl](https://firecrawl.mpp.tempo.xyz) | Web | Web scraping for LLMs |
| [Exa](https://exa.mpp.tempo.xyz) | Search | AI-powered web search |
| [Browserbase](https://mpp.browserbase.com) | Web | Headless browser sessions |
| [Alchemy](https://mpp.alchemy.com) | Blockchain | 100+ chain data APIs |
| [Dune](https://api.dune.com) | Blockchain | SQL queries on-chain data |
| [Allium](https://agents.allium.so) | Blockchain | Real-time blockchain data |

**Full list:** [mpp.dev/services](https://mpp.dev/services)

---

## 🧪 Testing

```bash
# Run all 49 tests across 11 packages
pnpm test

# Watch mode
pnpm test:watch

# Single package
cd packages/nextjs && pnpm test
```

---

## 📂 Project Structure

```
mpp-starter/
├── packages/
│   ├── nextjs/          # Next.js 16.2 (App Router)
│   ├── hono/            # Hono 4.12.8 (charge)
│   ├── hono-session/    # Hono 4.12.8 (sessions)
│   ├── elysia/          # Elysia 1.4.28 (Bun)
│   ├── express/         # Express 5.2.1
│   ├── fastify/         # Fastify 5.8.2
│   ├── koa/             # Koa 3.1.2
│   ├── nestjs/          # NestJS 11.1.17
│   ├── cloudflare-workers/
│   ├── vercel-edge/
│   ├── aws-lambda/
│   └── deno-deploy/
├── package.json
├── pnpm-workspace.yaml
└── vitest.workspace.ts
```

---

## 📚 Learn More

| Resource | Link |
|----------|------|
| MPP Documentation | [mpp.dev/docs](https://mpp.dev/docs) |
| Protocol Specification | [paymentauth.org](https://paymentauth.org) |
| Tempo Blockchain | [tempo.xyz](https://tempo.xyz) |
| Tempo Web Wallet | [wallet.tempo.xyz](https://wallet.tempo.xyz/welcome) |
| Tempo CLI | [tempo.xyz/install](https://tempo.xyz/install) |
| Services Directory | [mpp.dev/services](https://mpp.dev/services) |
| LLM Context | [mpp.dev/llms-full.txt](https://mpp.dev/llms-full.txt) |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a PR

---

## 🚀 Need Help Enabling Agentic Payments?

Want to integrate MPP into your API or product? We can help.

**[→ Contact GizmoLab](https://gizmolab.io/contact?utm_source=github&utm_medium=readme&utm_campaign=mpp-starter)**

We'll get you set up with payment-gated endpoints, sessions, and everything you need to monetize your API for AI agents.

---

## 📄 License

MIT © [GizmoLab](https://github.com/0xGizmolab)

---

## 🏷 Keywords

`mpp` `machine-payments-protocol` `http-402` `payment-gated-api` `tempo` `stripe` `stablecoin` `usdc` `api-monetization` `micropayments` `pay-per-request` `ai-agents` `llm-payments` `web3` `blockchain` `nextjs` `hono` `express` `fastify` `elysia` `nestjs` `serverless` `edge-functions`

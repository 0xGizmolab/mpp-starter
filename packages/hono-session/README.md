# MPP Example: Hono Sessions (Pay-as-you-go)

Hono server demonstrating **session-based payments** — high-throughput, low-latency pay-as-you-go billing using Tempo payment channels.

## What are Sessions?

Sessions use **payment channels** for efficient micropayments:

| Phase | What Happens | On-chain? |
|-------|--------------|-----------|
| **Open** | Client deposits funds into escrow contract | ✅ Once |
| **Pay** | Client signs vouchers for each request | ❌ Off-chain |
| **Verify** | Server checks voucher signature | ❌ CPU only |
| **Close** | Server settles final balance on-chain | ✅ Once |

### Why Sessions?

| Metric | One-time Charge | Session |
|--------|-----------------|---------|
| Latency per request | ~600ms | ~10ms |
| Cost per request | Gas fees | Near-zero |
| Best for | Single purchases | Streaming, LLM tokens, high-frequency |

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Server runs at `http://localhost:3008`

## Endpoints

| Endpoint | Payment Mode | Cost | Description |
|----------|--------------|------|-------------|
| `GET /health` | None | Free | Health check |
| `GET /free` | None | Free | Free endpoint |
| `GET /session/photo` | Session | $0.01 | Photo via payment channel |
| `GET /session/stream` | Session | $0.001 | Simulated streaming chunk |
| `GET /charge/photo` | Charge | $0.01 | Photo via one-time charge |

## Testing

### With Tempo CLI (recommended)

```bash
# Install Tempo wallet
curl -L https://tempo.xyz/install | bash
tempo wallet login
tempo wallet fund

# Make session-based requests
# First request opens channel, subsequent requests use vouchers
tempo request http://localhost:3008/session/photo
tempo request http://localhost:3008/session/photo  # Faster!
tempo request http://localhost:3008/session/photo  # Even faster!
```

### With npx

```bash
npx mppx account create
npx mppx http://localhost:3008/session/photo
```

## How It Works

### Server Setup

```typescript
import { Mppx, tempo } from 'mppx/server'

const mppx = Mppx.create({
  methods: [
    tempo.session({
      recipient: '0xYourWallet...',
      currency: '0x20c0000000000000000000000000000000000000',
      suggestedDeposit: '1', // Suggest 1 USD deposit
      testnet: true,
    }),
  ],
})

// Session endpoint — pay per request via vouchers
app.get('/session/photo', async (c) => {
  const result = await mppx.session({ amount: '0.01' })(c.req.raw)
  
  if (result.status === 402) return result.challenge
  
  return result.withReceipt(c.json({ photo: '...' }))
})
```

### Client Flow

```typescript
import { Mppx, tempo } from 'mppx/client'
import { privateKeyToAccount } from 'viem/accounts'

const mppx = Mppx.create({
  methods: [tempo({
    account: privateKeyToAccount('0x...'),
    maxDeposit: '1', // Lock up to 1 USD in channel
  })],
})

// First request: opens channel on-chain
const res1 = await fetch('http://localhost:3008/session/photo')

// Subsequent requests: off-chain vouchers (~10ms)
const res2 = await fetch('http://localhost:3008/session/photo')
const res3 = await fetch('http://localhost:3008/session/photo')

// Close channel and reclaim unspent deposit
const receipt = await mppx.close()
```

## Use Cases

- **LLM APIs** — Pay per token as content streams
- **Image Generation** — Pay per image generated  
- **Data APIs** — Pay per query/record
- **Content Feeds** — Pay per article/item

## Session vs Charge Comparison

```
Session (vouchers):
  Request 1: [open channel ~600ms] → response
  Request 2: [sign voucher ~10ms] → response  
  Request 3: [sign voucher ~10ms] → response
  ...
  Request N: [sign voucher ~10ms] → response
  Close: [settle on-chain ~600ms]

Charge (on-chain each time):
  Request 1: [on-chain tx ~600ms] → response
  Request 2: [on-chain tx ~600ms] → response
  Request 3: [on-chain tx ~600ms] → response
```

## Learn More

- [Sessions Documentation](https://mpp.dev/payment-methods/tempo/session)
- [Pay-as-you-go Guide](https://mpp.dev/guides/pay-as-you-go)
- [Streaming Payments](https://mpp.dev/guides/streamed-payments)

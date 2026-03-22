# MPP Example: Hono

Hono 4.12.8 with official `mppx/hono` middleware.

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
   npx mppx http://localhost:3001/paid
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| MPP_RECIPIENT | 0xf39... | Wallet to receive payments |
| MPP_CURRENCY | 0x20c... | Token address (pathUSD) |
| MPP_AMOUNT | 0.01 | Charge amount |
| MPP_WAIT_FOR_CONFIRMATION | true | Wait for on-chain confirm |

## Endpoints

- `GET /health` — Health check
- `GET /free` — Free endpoint
- `GET /paid` — Payment-gated endpoint

## Running Tests

```bash
pnpm test
```

## How It Works

The `/paid` route uses the `Mppx.create()` and `charge` middleware from `mppx/hono`:

```typescript
import { Mppx, tempo } from 'mppx/hono'

const mppx = Mppx.create({
  methods: [tempo({ recipient: '0x...', currency: '0x...', decimals: 6 })],
})

app.get('/paid', mppx.charge({ amount: '0.01' }), (c) => {
  return c.json({ message: 'Premium content unlocked!' })
})
```

When a request comes in without valid payment credentials, it returns a 402 status with `WWW-Authenticate: MPP ...` header.

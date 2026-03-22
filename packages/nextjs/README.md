# MPP Example: Next.js

Next.js 16.2 with official `mppx/nextjs` middleware.

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
   npx mppx http://localhost:3000/api/paid
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

- `GET /api/health` — Health check
- `GET /api/free` — Free endpoint
- `GET /api/paid` — Payment-gated endpoint

## Running Tests

```bash
pnpm test
```

## How It Works

The `/api/paid` route uses the `mppAuth` wrapper from `mppx/nextjs`:

```typescript
import { mppAuth } from 'mppx/nextjs'
import { mppConfig } from '@/src/mpp-config'

export const GET = mppAuth(
  async () => {
    return NextResponse.json({ message: 'Premium content unlocked!' })
  },
  mppConfig
)
```

When a request comes in without valid payment credentials, it returns a 402 status with `WWW-Authenticate: MPP ...` header instructing the client how to pay.

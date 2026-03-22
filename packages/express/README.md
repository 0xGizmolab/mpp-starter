# MPP Example: Express

Express 5.2.1 with official `mppx/express` middleware.

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
   npx mppx http://localhost:3003/paid
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

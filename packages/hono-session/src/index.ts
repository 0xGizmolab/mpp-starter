import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { Mppx, tempo } from 'mppx/server'
import { mppConfig } from './mpp-config.js'

const app = new Hono()

/**
 * Session-based MPP handler for pay-as-you-go billing.
 * 
 * Sessions use payment channels for high-throughput, low-latency payments:
 * - Client deposits funds into an on-chain escrow (once)
 * - Client signs off-chain vouchers for each request (~microseconds)
 * - Server verifies voucher signatures (no blockchain calls)
 * - Server settles on-chain periodically in batches
 * 
 * Perfect for: LLM token billing, streaming APIs, high-frequency calls
 */
const mppx = Mppx.create({
  // Secret key for signing challenges (use env var in production)
  secretKey: process.env.MPP_SECRET_KEY || 'dev-secret-key-for-testing-only',
  methods: [
    // Session method for pay-as-you-go
    tempo.session({
      recipient: mppConfig.recipient as `0x${string}`,
      currency: mppConfig.currency as `0x${string}`,
      decimals: 6,
      suggestedDeposit: '1', // Suggest client deposits 1 USD
      testnet: true,
    }),
    // Also support one-time charges
    tempo.charge({
      recipient: mppConfig.recipient as `0x${string}`,
      currency: mppConfig.currency as `0x${string}`,
      decimals: 6,
    }),
  ],
})

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    framework: 'hono-session',
    version: '4.12.8',
    paymentModes: ['session', 'charge'],
  })
})

// Free endpoint
app.get('/free', (c) => {
  return c.json({
    message: 'This is free!',
    timestamp: Date.now(),
  })
})

// Session-based endpoint — pay-as-you-go
// Client opens a payment channel once, then pays per request via vouchers
app.get('/session/photo', async (c) => {
  const result = await mppx.session({ 
    amount: mppConfig.amount,
    unitType: 'photo',
  })(c.req.raw)
  
  if (result.status === 402) {
    return result.challenge
  }
  
  // Generate a random photo (simulating paid content generation)
  const photoId = Math.floor(Math.random() * 1000)
  const photoUrl = `https://picsum.photos/id/${photoId}/400/300`
  
  return result.withReceipt(c.json({
    message: 'Photo generated!',
    photoUrl,
    photoId,
    cost: mppConfig.amount,
    timestamp: Date.now(),
  }))
})

// Session-based streaming endpoint — pay per chunk
app.get('/session/stream', async (c) => {
  const result = await mppx.session({ 
    amount: '0.001',
    unitType: 'chunk',
  })(c.req.raw) // $0.001 per chunk
  
  if (result.status === 402) {
    return result.challenge
  }
  
  // Simulate streaming content (like LLM tokens)
  return result.withReceipt(c.json({
    chunk: 'This is a streamed chunk of content',
    chunkIndex: Math.floor(Math.random() * 100),
    cost: '0.001',
    timestamp: Date.now(),
  }))
})

// One-time charge endpoint (for comparison)
app.get('/charge/photo', async (c) => {
  const result = await mppx.charge({ amount: mppConfig.amount })(c.req.raw)
  
  if (result.status === 402) {
    return result.challenge
  }
  
  const photoId = Math.floor(Math.random() * 1000)
  const photoUrl = `https://picsum.photos/id/${photoId}/400/300`
  
  return result.withReceipt(c.json({
    message: 'Photo generated (one-time charge)!',
    photoUrl,
    photoId,
    cost: mppConfig.amount,
    timestamp: Date.now(),
  }))
})

const PORT = parseInt(process.env.PORT || '3008')

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Hono Session server running at http://localhost:${PORT}`)
  console.log('')
  console.log('Endpoints:')
  console.log('  GET /session/photo  - Pay-as-you-go (voucher per request)')
  console.log('  GET /session/stream - Streaming payments ($0.001/chunk)')
  console.log('  GET /charge/photo   - One-time on-chain charge')
})

export { app }

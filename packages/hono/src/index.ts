import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { Mppx, tempo } from 'mppx/hono'
import { mppConfig } from './mpp-config.js'

const app = new Hono()

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    framework: 'hono',
    version: '4.12.8',
  })
})

// Free endpoint
app.get('/free', (c) => {
  return c.json({
    message: 'This is free!',
    timestamp: Date.now(),
  })
})

// Payment-gated endpoint with mppx middleware
const mppx = Mppx.create({
  methods: [
    tempo({
      recipient: mppConfig.recipient as `0x${string}`,
      currency: mppConfig.currency as `0x${string}`,
      decimals: 6,
      waitForConfirmation: mppConfig.waitForConfirmation,
    }),
  ],
})

app.get('/paid', mppx.charge({ amount: mppConfig.amount }), (c) => {
  return c.json({
    message: 'Premium content unlocked!',
    timestamp: Date.now(),
  })
})

// Export for testing
export { app }

// Start server if running directly
const port = parseInt(process.env.PORT ?? '3001')
console.log(`Hono server running at http://localhost:${port}`)
serve({ fetch: app.fetch, port })

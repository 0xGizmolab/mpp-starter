import express from 'express'
import { Mppx, tempo } from 'mppx/express'
import { mppConfig } from './mpp-config.js'

const app = express()

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

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    framework: 'express',
    version: '5.2.1',
  })
})

// Free endpoint
app.get('/free', (_req, res) => {
  res.json({
    message: 'This is free!',
    timestamp: Date.now(),
  })
})

// Payment-gated endpoint
app.get('/paid', mppx.charge({ amount: mppConfig.amount }), (_req, res) => {
  res.json({
    message: 'Premium content unlocked!',
    timestamp: Date.now(),
  })
})

// Export for testing
export { app }

// Start server if running directly
const port = parseInt(process.env.PORT ?? '3003')
app.listen(port, () => {
  console.log(\`Express server running at http://localhost:\${port}\`)
})

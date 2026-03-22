import { Elysia } from 'elysia'
import { Mppx, tempo } from 'mppx/elysia'
import { mppConfig } from './mpp-config.js'

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

const app = new Elysia()
  .get('/health', () => ({
    status: 'ok',
    framework: 'elysia',
    version: '1.4.28',
  }))
  .get('/free', () => ({
    message: 'This is free!',
    timestamp: Date.now(),
  }))
  .use(mppx.charge({ amount: mppConfig.amount }))
  .get('/paid', () => ({
    message: 'Premium content unlocked!',
    timestamp: Date.now(),
  }))
  .listen(3002)

console.log(`Elysia server running at http://localhost:${app.server?.port}`)

export { app }

import { Mppx, tempo } from 'mppx/nextjs'
import { mppConfig } from '@/src/mpp-config'

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

export const GET = mppx.charge({ amount: mppConfig.amount })(() =>
  Response.json({
    message: 'Premium content unlocked!',
    timestamp: Date.now(),
  })
)

import Fastify from 'fastify'
import { mppConfig } from './mpp-config.js'

const app = Fastify({ logger: true })

// Health check
app.get('/health', async () => ({
  status: 'ok',
  framework: 'fastify',
  version: '5.8.2',
}))

// Free endpoint
app.get('/free', async () => ({
  message: 'This is free!',
  timestamp: Date.now(),
}))

// Payment-gated endpoint with manual MPP check
app.get('/paid', {
  preHandler: async (request, reply) => {
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('MPP ')) {
      reply.code(402).header(
        'WWW-Authenticate',
        \`MPP realm="api", method="tempo", params="recipient=\${mppConfig.recipient},currency=\${mppConfig.currency},amount=\${mppConfig.amount}"\`
      ).send({ error: 'Payment required' })
    }
  },
}, async () => ({
  message: 'Premium content unlocked!',
  timestamp: Date.now(),
}))

// Export for testing
export { app }

// Start server if running directly
const port = parseInt(process.env.PORT ?? '3004')
app.listen({ port }).then(() => {
  console.log(\`Fastify server running at http://localhost:\${port}\`)
})

import Koa from 'koa'
import Router from '@koa/router'
import { mppConfig } from './mpp-config.js'

const app = new Koa()
const router = new Router()

// MPP middleware
const mppAuth = async (ctx: Koa.Context, next: Koa.Next) => {
  const authHeader = ctx.get('Authorization')
  if (!authHeader || !authHeader.startsWith('MPP ')) {
    ctx.status = 402
    ctx.set(
      'WWW-Authenticate',
      \`MPP realm="api", method="tempo", params="recipient=\${mppConfig.recipient},currency=\${mppConfig.currency},amount=\${mppConfig.amount}"\`
    )
    ctx.body = { error: 'Payment required' }
    return
  }
  await next()
}

// Health check
router.get('/health', (ctx) => {
  ctx.body = {
    status: 'ok',
    framework: 'koa',
    version: '3.1.2',
  }
})

// Free endpoint
router.get('/free', (ctx) => {
  ctx.body = {
    message: 'This is free!',
    timestamp: Date.now(),
  }
})

// Payment-gated endpoint
router.get('/paid', mppAuth, (ctx) => {
  ctx.body = {
    message: 'Premium content unlocked!',
    timestamp: Date.now(),
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

// Export for testing
export { app, router }

// Start server if running directly
const port = parseInt(process.env.PORT ?? '3005')
app.listen(port, () => {
  console.log(\`Koa server running at http://localhost:\${port}\`)
})

import { describe, it, expect, vi } from 'vitest'
import { Hono } from 'hono'

// Mock mppx/hono before importing
vi.mock('mppx/hono', () => ({
  Mppx: {
    create: () => ({
      charge: () => {
        return async (c: any, next: () => Promise<void>) => {
          const authHeader = c.req.header('Authorization')
          if (!authHeader || !authHeader.startsWith('MPP ')) {
            return c.json(null, 402, {
              'WWW-Authenticate': 'MPP realm="api", method="tempo", params="amount=0.01"',
            })
          }
          await next()
        }
      },
    }),
  },
  tempo: () => [],
}))

// Create test app with mocked middleware
async function createTestApp() {
  const { Mppx, tempo } = await import('mppx/hono')
  
  const app = new Hono()
  
  app.get('/health', (c) => {
    return c.json({
      status: 'ok',
      framework: 'hono',
      version: '4.12.8',
    })
  })

  app.get('/free', (c) => {
    return c.json({
      message: 'This is free!',
      timestamp: Date.now(),
    })
  })

  const mppx = Mppx.create({ methods: [tempo()] })
  
  app.get('/paid', mppx.charge({ amount: '0.01' }), (c) => {
    return c.json({
      message: 'Premium content unlocked!',
      timestamp: Date.now(),
    })
  })

  return app
}

describe('Hono API Routes', () => {
  describe('GET /health', () => {
    it('returns 200 with framework info', async () => {
      const app = await createTestApp()
      const res = await app.request('/health')
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data).toEqual({
        status: 'ok',
        framework: 'hono',
        version: '4.12.8',
      })
    })
  })

  describe('GET /free', () => {
    it('returns 200 with message', async () => {
      const app = await createTestApp()
      const res = await app.request('/free')
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.message).toBe('This is free!')
      expect(typeof data.timestamp).toBe('number')
    })
  })

  describe('GET /paid', () => {
    it('returns 402 without credentials', async () => {
      const app = await createTestApp()
      const res = await app.request('/paid')

      expect(res.status).toBe(402)
      expect(res.headers.get('WWW-Authenticate')).toContain('MPP')
    })

    it('returns 200 with valid credentials', async () => {
      const app = await createTestApp()
      const res = await app.request('/paid', {
        headers: {
          'Authorization': 'MPP valid-credential',
        },
      })
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.message).toBe('Premium content unlocked!')
      expect(typeof data.timestamp).toBe('number')
    })
  })
})

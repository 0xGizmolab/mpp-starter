import { describe, it, expect, vi } from 'vitest'
import { Elysia } from 'elysia'

// Mock mppx/elysia before importing
vi.mock('mppx/elysia', () => ({
  Mppx: {
    create: () => ({
      charge: () => {
        return (app: any) => {
          return app.derive(({ request }: { request: Request }) => {
            const authHeader = request.headers.get('Authorization')
            return { hasMppAuth: authHeader?.startsWith('MPP ') }
          }).onBeforeHandle(({ set, hasMppAuth }: any) => {
            if (!hasMppAuth) {
              set.status = 402
              set.headers['WWW-Authenticate'] = 'MPP realm="api", method="tempo", params="amount=0.01"'
              return new Response(null, {
                status: 402,
                headers: { 'WWW-Authenticate': 'MPP realm="api", method="tempo", params="amount=0.01"' }
              })
            }
          })
        }
      },
    }),
  },
  tempo: () => [],
}))

// Create test app with mocked middleware
async function createTestApp() {
  const { Mppx, tempo } = await import('mppx/elysia')
  
  const mppx = Mppx.create({ methods: [tempo()] })

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
    .use(mppx.charge({ amount: '0.01' }))
    .get('/paid', () => ({
      message: 'Premium content unlocked!',
      timestamp: Date.now(),
    }))

  return app
}

describe('Elysia API Routes', () => {
  describe('GET /health', () => {
    it('returns 200 with framework info', async () => {
      const app = await createTestApp()
      const res = await app.handle(new Request('http://localhost/health'))
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data).toEqual({
        status: 'ok',
        framework: 'elysia',
        version: '1.4.28',
      })
    })
  })

  describe('GET /free', () => {
    it('returns 200 with message', async () => {
      const app = await createTestApp()
      const res = await app.handle(new Request('http://localhost/free'))
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.message).toBe('This is free!')
      expect(typeof data.timestamp).toBe('number')
    })
  })

  describe('GET /paid', () => {
    it('returns 402 without credentials', async () => {
      const app = await createTestApp()
      const res = await app.handle(new Request('http://localhost/paid'))

      expect(res.status).toBe(402)
      expect(res.headers.get('WWW-Authenticate')).toContain('MPP')
    })

    it('returns 200 with valid credentials', async () => {
      const app = await createTestApp()
      const res = await app.handle(new Request('http://localhost/paid', {
        headers: {
          'Authorization': 'MPP valid-credential',
        },
      }))
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.message).toBe('Premium content unlocked!')
      expect(typeof data.timestamp).toBe('number')
    })
  })
})

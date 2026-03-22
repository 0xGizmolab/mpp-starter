import { describe, it, expect, vi, beforeAll } from 'vitest'

// Mock mppx/nextjs before imports
vi.mock('mppx/nextjs', () => ({
  Mppx: {
    create: () => ({
      charge: () => (handler: (req: Request) => Response) => {
        return (req: Request) => {
          // Check for MPP authorization header
          const authHeader = req.headers.get('Authorization')
          if (!authHeader || !authHeader.startsWith('MPP ')) {
            return new Response(null, {
              status: 402,
              headers: {
                'WWW-Authenticate': 'MPP realm="api", method="tempo", params="amount=0.01,currency=0x20c0000000000000000000000000000000000000"',
              },
            })
          }
          return handler(req)
        }
      },
    }),
  },
  tempo: () => [],
}))

describe('Next.js API Routes', () => {
  describe('GET /api/health', () => {
    it('returns 200 with framework info', async () => {
      const { GET: healthHandler } = await import('../app/api/health/route')
      const response = await healthHandler()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        status: 'ok',
        framework: 'nextjs',
        version: '16.2',
      })
    })
  })

  describe('GET /api/free', () => {
    it('returns 200 with message', async () => {
      const { GET: freeHandler } = await import('../app/api/free/route')
      const response = await freeHandler()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('This is free!')
      expect(typeof data.timestamp).toBe('number')
    })
  })

  describe('GET /api/paid', () => {
    it('returns 402 without credentials', async () => {
      const { GET: paidHandler } = await import('../app/api/paid/route')
      
      // Create a mock request without auth
      const request = new Request('http://localhost:3000/api/paid')
      const response = await paidHandler(request)

      expect(response.status).toBe(402)
      expect(response.headers.get('WWW-Authenticate')).toContain('MPP')
    })

    it('returns 200 with valid credentials', async () => {
      const { GET: paidHandler } = await import('../app/api/paid/route')
      
      // Create a mock request with auth header
      const request = new Request('http://localhost:3000/api/paid', {
        headers: {
          'Authorization': 'MPP valid-credential',
        },
      })
      const response = await paidHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Premium content unlocked!')
      expect(typeof data.timestamp).toBe('number')
    })
  })
})

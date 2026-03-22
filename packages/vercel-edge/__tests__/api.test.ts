import { describe, it, expect } from 'vitest'

// Mock the edge function handlers
function healthHandler() {
  return Response.json({
    status: 'ok',
    framework: 'vercel-edge',
    version: '1.0',
  })
}

function freeHandler() {
  return Response.json({
    message: 'This is free!',
    timestamp: Date.now(),
  })
}

function paidHandler(request: Request) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('MPP ')) {
    return new Response(JSON.stringify({ error: 'Payment required' }), {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'MPP realm="api"',
      },
    })
  }

  return Response.json({
    message: 'Premium content unlocked!',
    timestamp: Date.now(),
  })
}

describe('Vercel Edge API', () => {
  describe('GET /api/health', () => {
    it('returns 200 with framework info', async () => {
      const res = healthHandler()
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data).toEqual({
        status: 'ok',
        framework: 'vercel-edge',
        version: '1.0',
      })
    })
  })

  describe('GET /api/free', () => {
    it('returns 200 with message', async () => {
      const res = freeHandler()
      const data = await res.json() as { message: string; timestamp: number }

      expect(res.status).toBe(200)
      expect(data.message).toBe('This is free!')
    })
  })

  describe('GET /api/paid', () => {
    it('returns 402 without credentials', async () => {
      const res = paidHandler(new Request('http://localhost/api/paid'))

      expect(res.status).toBe(402)
      expect(res.headers.get('WWW-Authenticate')).toContain('MPP')
    })

    it('returns 200 with valid credentials', async () => {
      const res = paidHandler(
        new Request('http://localhost/api/paid', {
          headers: { Authorization: 'MPP valid-credential' },
        })
      )
      const data = await res.json() as { message: string }

      expect(res.status).toBe(200)
      expect(data.message).toBe('Premium content unlocked!')
    })
  })
})

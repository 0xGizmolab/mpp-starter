import { describe, it, expect } from 'vitest'

// Mock the worker handler
const mockEnv = {
  MPP_RECIPIENT: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  MPP_CURRENCY: '0x20c0000000000000000000000000000000000000',
  MPP_AMOUNT: '0.01',
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)

  switch (url.pathname) {
    case '/health':
      return Response.json({
        status: 'ok',
        framework: 'cloudflare-workers',
        version: '1.0',
      })

    case '/free':
      return Response.json({
        message: 'This is free!',
        timestamp: Date.now(),
      })

    case '/paid': {
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

    default:
      return new Response('Not Found', { status: 404 })
  }
}

describe('Cloudflare Workers API', () => {
  describe('GET /health', () => {
    it('returns 200 with framework info', async () => {
      const res = await handleRequest(new Request('http://localhost/health'))
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data).toEqual({
        status: 'ok',
        framework: 'cloudflare-workers',
        version: '1.0',
      })
    })
  })

  describe('GET /free', () => {
    it('returns 200 with message', async () => {
      const res = await handleRequest(new Request('http://localhost/free'))
      const data = await res.json() as { message: string; timestamp: number }

      expect(res.status).toBe(200)
      expect(data.message).toBe('This is free!')
    })
  })

  describe('GET /paid', () => {
    it('returns 402 without credentials', async () => {
      const res = await handleRequest(new Request('http://localhost/paid'))

      expect(res.status).toBe(402)
      expect(res.headers.get('WWW-Authenticate')).toContain('MPP')
    })

    it('returns 200 with valid credentials', async () => {
      const res = await handleRequest(
        new Request('http://localhost/paid', {
          headers: { Authorization: 'MPP valid-credential' },
        })
      )
      const data = await res.json() as { message: string }

      expect(res.status).toBe(200)
      expect(data.message).toBe('Premium content unlocked!')
    })
  })
})

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify from 'fastify'

describe('Fastify API Routes', () => {
  const app = Fastify()

  beforeAll(async () => {
    app.get('/health', async () => ({
      status: 'ok',
      framework: 'fastify',
      version: '5.8.2',
    }))

    app.get('/free', async () => ({
      message: 'This is free!',
      timestamp: Date.now(),
    }))

    app.get('/paid', {
      preHandler: async (request, reply) => {
        const authHeader = request.headers.authorization
        if (!authHeader || !authHeader.startsWith('MPP ')) {
          reply.code(402).header('WWW-Authenticate', 'MPP realm="api"').send()
        }
      },
    }, async () => ({
      message: 'Premium content unlocked!',
      timestamp: Date.now(),
    }))

    await app.ready()
  })

  afterAll(() => app.close())

  describe('GET /health', () => {
    it('returns 200 with framework info', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' })
      const data = res.json()

      expect(res.statusCode).toBe(200)
      expect(data).toEqual({
        status: 'ok',
        framework: 'fastify',
        version: '5.8.2',
      })
    })
  })

  describe('GET /free', () => {
    it('returns 200 with message', async () => {
      const res = await app.inject({ method: 'GET', url: '/free' })
      const data = res.json()

      expect(res.statusCode).toBe(200)
      expect(data.message).toBe('This is free!')
      expect(typeof data.timestamp).toBe('number')
    })
  })

  describe('GET /paid', () => {
    it('returns 402 without credentials', async () => {
      const res = await app.inject({ method: 'GET', url: '/paid' })

      expect(res.statusCode).toBe(402)
      expect(res.headers['www-authenticate']).toContain('MPP')
    })

    it('returns 200 with valid credentials', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/paid',
        headers: { authorization: 'MPP valid-credential' },
      })
      const data = res.json()

      expect(res.statusCode).toBe(200)
      expect(data.message).toBe('Premium content unlocked!')
    })
  })
})

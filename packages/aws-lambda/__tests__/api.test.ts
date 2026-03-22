import { describe, it, expect } from 'vitest'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// Mock handler
async function handler(event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> {
  const path = event.path || ''
  const authHeader = event.headers?.authorization || event.headers?.Authorization

  switch (path) {
    case '/health':
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ok',
          framework: 'aws-lambda',
          version: '1.0',
        }),
      }

    case '/free':
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'This is free!',
          timestamp: Date.now(),
        }),
      }

    case '/paid':
      if (!authHeader || !authHeader.startsWith('MPP ')) {
        return {
          statusCode: 402,
          headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'MPP realm="api"',
          },
          body: JSON.stringify({ error: 'Payment required' }),
        }
      }
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Premium content unlocked!',
          timestamp: Date.now(),
        }),
      }

    default:
      return { statusCode: 404, body: 'Not Found' }
  }
}

describe('AWS Lambda API', () => {
  describe('GET /health', () => {
    it('returns 200 with framework info', async () => {
      const res = await handler({ path: '/health', headers: {} })
      const data = JSON.parse(res.body)

      expect(res.statusCode).toBe(200)
      expect(data).toEqual({
        status: 'ok',
        framework: 'aws-lambda',
        version: '1.0',
      })
    })
  })

  describe('GET /free', () => {
    it('returns 200 with message', async () => {
      const res = await handler({ path: '/free', headers: {} })
      const data = JSON.parse(res.body)

      expect(res.statusCode).toBe(200)
      expect(data.message).toBe('This is free!')
    })
  })

  describe('GET /paid', () => {
    it('returns 402 without credentials', async () => {
      const res = await handler({ path: '/paid', headers: {} })

      expect(res.statusCode).toBe(402)
      expect(res.headers?.['WWW-Authenticate']).toContain('MPP')
    })

    it('returns 200 with valid credentials', async () => {
      const res = await handler({
        path: '/paid',
        headers: { authorization: 'MPP valid-credential' },
      })
      const data = JSON.parse(res.body)

      expect(res.statusCode).toBe(200)
      expect(data.message).toBe('Premium content unlocked!')
    })
  })
})

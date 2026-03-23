import { describe, it, expect } from 'vitest'
import { app } from '../src/index.js'

describe('Hono Session API', () => {
  it('GET /health returns ok with payment modes', async () => {
    const res = await app.request('/health')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
    expect(body.framework).toBe('hono-session')
    expect(body.paymentModes).toContain('session')
    expect(body.paymentModes).toContain('charge')
  })

  it('GET /free returns message without auth', async () => {
    const res = await app.request('/free')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toBe('This is free!')
  })

  it('GET /session/photo returns 402 without credentials', async () => {
    const res = await app.request('/session/photo')
    expect(res.status).toBe(402)
    expect(res.headers.get('www-authenticate')).toBeDefined()
  })

  it('GET /session/stream returns 402 without credentials', async () => {
    const res = await app.request('/session/stream')
    expect(res.status).toBe(402)
  })

  it('GET /charge/photo returns 402 without credentials', async () => {
    const res = await app.request('/charge/photo')
    expect(res.status).toBe(402)
  })
})

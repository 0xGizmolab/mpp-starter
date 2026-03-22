import { mppConfig } from './mpp-config.ts'

function handleRequest(request: Request): Response {
  const url = new URL(request.url)

  switch (url.pathname) {
    case '/health':
      return Response.json({
        status: 'ok',
        framework: 'deno-deploy',
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
            'WWW-Authenticate': \`MPP realm="api", method="tempo", params="recipient=\${mppConfig.recipient},currency=\${mppConfig.currency},amount=\${mppConfig.amount}"\`,
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

// Deno.serve for Deno Deploy
if (typeof Deno !== 'undefined') {
  Deno.serve(handleRequest)
}

export { handleRequest }

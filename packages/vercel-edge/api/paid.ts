import { mppConfig } from './mpp-config'

export const config = { runtime: 'edge' }

export default function handler(request: Request) {
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

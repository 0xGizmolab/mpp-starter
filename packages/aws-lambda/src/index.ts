import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { mppConfig } from './mpp-config.js'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const path = event.path || event.rawPath
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
            'WWW-Authenticate': \`MPP realm="api", method="tempo", params="recipient=\${mppConfig.recipient},currency=\${mppConfig.currency},amount=\${mppConfig.amount}"\`,
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
      return {
        statusCode: 404,
        body: 'Not Found',
      }
  }
}

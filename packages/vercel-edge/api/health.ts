export const config = { runtime: 'edge' }

export default function handler() {
  return Response.json({
    status: 'ok',
    framework: 'vercel-edge',
    version: '1.0',
  })
}

export const config = { runtime: 'edge' }

export default function handler() {
  return Response.json({
    message: 'This is free!',
    timestamp: Date.now(),
  })
}

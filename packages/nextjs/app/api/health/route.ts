import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    framework: 'nextjs',
    version: '16.2',
  })
}

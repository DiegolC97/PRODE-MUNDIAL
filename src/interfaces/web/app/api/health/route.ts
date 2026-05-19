import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'web-bff',
    timestamp: new Date().toISOString(),
  });
}

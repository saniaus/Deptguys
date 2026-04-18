import { NextResponse } from 'next/server'

export function middleware(req) {
  if (req.method === 'POST' || req.method === 'DELETE') {
    if (req.headers.get('x-admin-key') !== process.env.ADMIN_KEY) {
      return new Response('Unauthorized', { status: 401 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/debts', '/api/pay']
}

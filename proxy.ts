import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  if (token && pathname === '/login') {
    return NextResponse.redirect(
      new URL('/dashboard', request.url)
    )
  }

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  // ✅ Allow request
  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}

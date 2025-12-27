import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export type JWTUser = {
  id: string
  email: string
  role: 'ADMIN' | 'SUPERVISOR' | 'DELIVERY_MAN'
  esId?: string
}

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  if (pathname === '/login') {
    if (!token) return NextResponse.next()
  }

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!token) {
    return NextResponse.next()
  }

  let payload: JWTUser
  try {
    const verified = await jose.jwtVerify<JWTUser>(token, jwtSecret, {
      algorithms: ['HS256'],
    })
    payload = verified.payload
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname === '/dashboard') {
    if (payload.role === 'ADMIN')
      return NextResponse.redirect(new URL('/dashboard/admin', request.url))

    if (payload.role === 'SUPERVISOR')
      return NextResponse.redirect(new URL('/dashboard/supervisor', request.url))

    if (payload.role === 'DELIVERY_MAN')
      return NextResponse.redirect(new URL('/dashboard/deliveryman', request.url))
  }

  if (pathname.startsWith('/dashboard/admin') && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (
    pathname.startsWith('/dashboard/supervisor') &&
    payload.role !== 'SUPERVISOR'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (
    pathname.startsWith('/dashboard/deliveryman') &&
    payload.role !== 'DELIVERY_MAN'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}

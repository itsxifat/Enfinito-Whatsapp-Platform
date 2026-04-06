import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth.js'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/pending-approval',
  '/privacy',
  '/terms',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/google',
  '/api/auth/google/callback',
  '/api/v1/webhook',
]

const DASHBOARD_PATHS = [
  '/dashboard',
  '/instances',
  '/api-keys',
  '/settings',
  '/docs',
  '/profile',
]

export async function proxy(request) {
  const { pathname } = request.nextUrl

  // Static assets — always pass through
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/avatars/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Public paths — no auth required
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Public API with key-based auth (handled inside route)
  if (pathname.startsWith('/api/v1/')) {
    return NextResponse.next()
  }

  // Helper: extract + verify JWT
  const token = request.cookies.get('access_token')?.value
  let session = null
  if (token) {
    const { valid, payload } = await verifyToken(token)
    if (valid) session = payload
  }

  // ── Admin routes: require admin role ──────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin/')) {
    if (!session) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // ── Dashboard / protected page routes ────────────────────────────────────
  if (DASHBOARD_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Block unapproved users — redirect to a pending page
    if (!session.is_approved) {
      return NextResponse.redirect(new URL('/pending-approval', request.url))
    }
    return NextResponse.next()
  }

  // ── Protected API routes ──────────────────────────────────────────────────
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/v1/')) {
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    if (!session.is_approved) return NextResponse.json({ error: 'Account pending approval.' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
}

import { NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

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

// ── JWT helpers ────────────────────────────────────────────────────────────

async function verify(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

async function mintAccessToken(payload) {
  return new SignJWT({
    sub: payload.sub,
    name: payload.name,
    role: payload.role,
    is_approved: payload.is_approved,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET)
}

/**
 * Replace the access_token value in the raw Cookie header string so that
 * downstream server components (via next/headers cookies()) receive the fresh token.
 */
function patchCookieHeader(original, newToken) {
  const stripped = (original || '').replace(/(?:^|;\s*)access_token=[^;]*/g, '').replace(/^;\s*/, '')
  return `access_token=${newToken}${stripped ? '; ' + stripped : ''}`
}

// ── Proxy ──────────────────────────────────────────────────────────────────

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

  // Public API routes authenticated by API key inside the route handler
  if (pathname.startsWith('/api/v1/')) {
    return NextResponse.next()
  }

  // ── Resolve session ──────────────────────────────────────────────────────
  let session = null
  let refreshedToken = null   // will be set when we silently refresh

  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (accessToken) {
    session = await verify(accessToken)
  }

  // Access token missing or expired — try the refresh token silently
  if (!session && refreshToken) {
    const refreshPayload = await verify(refreshToken)
    if (refreshPayload) {
      session = refreshPayload
      refreshedToken = await mintAccessToken(refreshPayload)
    }
  }

  // ── Helper: build a continuing response, optionally with refreshed cookie ─
  function continueWith() {
    if (!refreshedToken) return NextResponse.next()

    // Patch the Cookie header so server components see the new access_token
    const newHeaders = new Headers(request.headers)
    newHeaders.set('cookie', patchCookieHeader(request.headers.get('cookie'), refreshedToken))

    const res = NextResponse.next({ request: { headers: newHeaders } })

    // Send new cookie to browser so future requests use the refreshed token
    res.cookies.set('access_token', refreshedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours
    })
    return res
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
    return continueWith()
  }

  // ── Dashboard / protected page routes ────────────────────────────────────
  if (DASHBOARD_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (!session.is_approved) {
      return NextResponse.redirect(new URL('/pending-approval', request.url))
    }
    return continueWith()
  }

  // ── Protected API routes ──────────────────────────────────────────────────
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/v1/')) {
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    if (!session.is_approved) return NextResponse.json({ error: 'Account pending approval.' }, { status: 403 })
    return continueWith()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
}

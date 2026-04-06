import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)
const ACCESS_TOKEN_TTL = '2h'
const REFRESH_TOKEN_TTL = '30d'

export async function signAccessToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(JWT_SECRET)
}

export async function signRefreshToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(JWT_SECRET)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { valid: true, payload }
  } catch {
    return { valid: false, payload: null }
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) return null
  const { valid, payload } = await verifyToken(token)
  if (!valid) return null
  return payload
}

export function setAuthCookies(res, accessToken, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production'
  res.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2, // 2 hours
  })
  res.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export function clearAuthCookies(res) {
  res.cookies.set('access_token', '', { maxAge: 0, path: '/' })
  res.cookies.set('refresh_token', '', { maxAge: 0, path: '/' })
}

// Build JWT payload — always include role so proxy can gate admin routes
export function buildTokenPayload(user) {
  return {
    sub: user.id,
    name: user.name,
    role: user.role || 'user',
    is_approved: !!user.is_approved,
  }
}

// Verify admin role from session payload — use in route handlers for defence-in-depth
export function isAdmin(session) {
  return session?.role === 'admin'
}

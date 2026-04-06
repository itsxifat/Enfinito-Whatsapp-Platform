import { NextResponse } from 'next/server'
import { generateSecureToken } from '@/lib/crypto.js'

export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Google OAuth is not configured.' }, { status: 503 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const redirectUri = `${baseUrl}/api/auth/google/callback`

  // CSRF protection: random state token stored in a short-lived cookie
  const state = generateSecureToken(16)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  const response = NextResponse.redirect(googleAuthUrl)

  const isProd = process.env.NODE_ENV === 'production'
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  return response
}

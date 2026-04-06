import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getDb, ensureIndexes } from '@/lib/db.js'
import { encrypt } from '@/lib/crypto.js'
import { signAccessToken, signRefreshToken, setAuthCookies, buildTokenPayload } from '@/lib/auth.js'
import crypto from 'crypto'

export async function GET(request) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const errorParam = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  if (errorParam) {
    return NextResponse.redirect(new URL('/login?error=google_denied', baseUrl))
  }

  // Verify CSRF state
  const savedState = request.cookies.get('oauth_state')?.value
  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', baseUrl))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', baseUrl))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?error=oauth_not_configured', baseUrl))
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`

  // Exchange code for tokens
  let tokens
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    tokens = await tokenRes.json()
    if (!tokenRes.ok || tokens.error) throw new Error(tokens.error || 'token_exchange_failed')
  } catch {
    return NextResponse.redirect(new URL('/login?error=token_exchange', baseUrl))
  }

  // Get user info from Google
  let googleUser
  try {
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    googleUser = await userRes.json()
    if (!googleUser.email) throw new Error('no_email')
  } catch {
    return NextResponse.redirect(new URL('/login?error=userinfo_failed', baseUrl))
  }

  await ensureIndexes()
  const db = await getDb()
  const emailHash = crypto.createHash('sha256').update(googleUser.email.toLowerCase()).digest('hex')

  // Look up by google_id first, then by email
  let user = await db.collection('users').findOne({ google_id: googleUser.id, is_active: true })
  if (!user) {
    user = await db.collection('users').findOne({ email_hash: emailHash, is_active: true })
  }

  if (user) {
    // Link google_id if not set yet
    if (!user.google_id) {
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { google_id: googleUser.id, auth_provider: 'google' } }
      )
      user.google_id = googleUser.id
      user.auth_provider = 'google'
    }

    if (!user.is_approved && user.role !== 'admin') {
      const response = NextResponse.redirect(new URL('/pending-approval', baseUrl))
      response.cookies.delete('oauth_state')
      return response
    }

    const userDoc = { id: user._id, ...user }
    const payload = buildTokenPayload(userDoc)
    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)

    const response = NextResponse.redirect(new URL('/dashboard', baseUrl))
    setAuthCookies(response, accessToken, refreshToken)
    response.cookies.delete('oauth_state')
    return response
  }

  // New user via Google
  const userCount = await db.collection('users').countDocuments()
  const isFirst = userCount === 0
  const role = isFirst ? 'admin' : 'user'
  const isApproved = isFirst

  const id = uuidv4()
  const emailEncrypted = encrypt(googleUser.email.toLowerCase())
  const avatarUrl = googleUser.picture || null

  await db.collection('users').insertOne({
    _id: id,
    name: googleUser.name || googleUser.email.split('@')[0],
    email_encrypted: emailEncrypted,
    email_hash: emailHash,
    password_hash: '',
    plan: 'free',
    role,
    is_active: true,
    is_approved: isApproved,
    max_instances: null,
    avatar_url: avatarUrl,
    bio: null,
    auth_provider: 'google',
    google_id: googleUser.id,
    created_at: Math.floor(Date.now() / 1000),
  })

  const response = NextResponse.redirect(
    new URL(isApproved ? '/dashboard' : '/pending-approval', baseUrl)
  )
  response.cookies.delete('oauth_state')

  if (isApproved) {
    const newUser = { id, name: googleUser.name, role, is_approved: true }
    const payload = buildTokenPayload(newUser)
    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)
    setAuthCookies(response, accessToken, refreshToken)
  }

  return response
}

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getDb } from '@/lib/db.js'
import { signAccessToken, signRefreshToken, setAuthCookies, buildTokenPayload } from '@/lib/auth.js'
import { authRateLimit } from '@/lib/ratelimit.js'
import crypto from 'crypto'

const schema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
})

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const limit = await authRateLimit(ip)
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 })
  }

  const { email, password } = parsed.data
  const db = await getDb()

  const emailHash = crypto.createHash('sha256').update(email).digest('hex')
  const user = await db.collection('users').findOne({ email_hash: emailHash, is_active: true })

  // Block OAuth-only accounts from password login
  if (user && user.auth_provider !== 'local' && !user.password_hash) {
    return NextResponse.json({
      error: 'This account uses Google Sign-In. Please continue with Google.',
    }, { status: 400 })
  }

  // Constant-time: always run bcrypt even if user not found to prevent timing attacks
  const passwordHash = user?.password_hash || '$2b$12$invalidhashfortimingprotection000000000000000000000000000'
  const valid = await bcrypt.compare(password, passwordHash)

  if (!user || !valid) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  if (!user.is_approved && user.role !== 'admin') {
    return NextResponse.json({
      error: 'Your account is pending administrator approval.',
      pending: true,
    }, { status: 403 })
  }

  const userDoc = { id: user._id, ...user }
  const payload = buildTokenPayload(userDoc)
  const accessToken = await signAccessToken(payload)
  const refreshToken = await signRefreshToken(payload)

  const response = NextResponse.json({
    message: 'Logged in successfully.',
    user: { id: user._id, name: user.name, plan: user.plan, role: user.role },
  })
  setAuthCookies(response, accessToken, refreshToken)
  return response
}

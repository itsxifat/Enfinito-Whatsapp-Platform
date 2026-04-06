import { NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '@/lib/db.js'
import { decrypt, generateSecureToken } from '@/lib/crypto.js'
import { sendPasswordResetEmail } from '@/lib/email.js'
import { authRateLimit } from '@/lib/ratelimit.js'
import crypto from 'crypto'

const schema = z.object({
  email: z.string().email().toLowerCase().trim(),
})

// Hash reset token with HMAC keyed by JWT_SECRET for extra security
function hashResetToken(token) {
  const secret = process.env.JWT_SECRET || 'fallback-secret'
  return crypto.createHmac('sha256', secret).update(token).digest('hex')
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const limit = await authRateLimit(ip)
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const { email } = parsed.data

  // Always return success — never reveal whether an email exists
  const successResponse = NextResponse.json({
    message: 'If an account exists with that email, a reset link has been sent.',
  })

  const db = await getDb()
  const emailHash = crypto.createHash('sha256').update(email).digest('hex')
  const user = await db.collection('users').findOne(
    { email_hash: emailHash, is_active: true },
    { projection: { _id: 1, email_encrypted: 1, auth_provider: 1 } }
  )

  if (!user) return successResponse

  // Google-only users don't have a password to reset
  if (user.auth_provider !== 'local') return successResponse

  // Invalidate any previous unused tokens for this user
  await db.collection('password_reset_tokens').deleteMany({ user_id: user._id, used_at: null })

  const rawToken = generateSecureToken(32)
  const tokenHash = hashResetToken(rawToken)
  const expiresAt = Math.floor(Date.now() / 1000) + 3600 // 1 hour

  await db.collection('password_reset_tokens').insertOne({
    _id: uuidv4(),
    user_id: user._id,
    token_hash: tokenHash,
    expires_at: expiresAt,
    used_at: null,
    created_at: Math.floor(Date.now() / 1000),
  })

  // Decrypt email to send the message
  let plainEmail
  try { plainEmail = decrypt(user.email_encrypted) } catch { return successResponse }

  await sendPasswordResetEmail(plainEmail, rawToken)

  return successResponse
}

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getDb } from '@/lib/db.js'
import { authRateLimit } from '@/lib/ratelimit.js'
import crypto from 'crypto'

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
})

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
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { token, password } = parsed.data
  const tokenHash = hashResetToken(token)
  const now = Math.floor(Date.now() / 1000)

  const db = await getDb()
  const resetRecord = await db.collection('password_reset_tokens').findOne({
    token_hash: tokenHash,
    expires_at: { $gt: now },
    used_at: null,
  })

  if (!resetRecord) {
    return NextResponse.json({
      error: 'This reset link is invalid or has expired. Please request a new one.',
    }, { status: 400 })
  }

  const newHash = await bcrypt.hash(password, 12)

  // Update password and mark token as used
  await db.collection('users').updateOne(
    { _id: resetRecord.user_id },
    { $set: { password_hash: newHash, auth_provider: 'local' } }
  )
  await db.collection('password_reset_tokens').updateOne(
    { _id: resetRecord._id },
    { $set: { used_at: now } }
  )

  return NextResponse.json({ message: 'Password updated. You can now sign in.' })
}

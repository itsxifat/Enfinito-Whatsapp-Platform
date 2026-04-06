import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { getDb, ensureIndexes } from '@/lib/db.js'
import { encrypt } from '@/lib/crypto.js'
import { signAccessToken, signRefreshToken, setAuthCookies, buildTokenPayload } from '@/lib/auth.js'
import { authRateLimit } from '@/lib/ratelimit.js'
import crypto from 'crypto'

const schema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
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
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { name, email, password } = parsed.data

  await ensureIndexes()
  const db = await getDb()

  const emailHash = crypto.createHash('sha256').update(email).digest('hex')
  const existing = await db.collection('users').findOne({ email_hash: emailHash }, { projection: { _id: 1 } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  // First-ever user becomes admin (auto-approved); all others are pending
  const userCount = await db.collection('users').countDocuments()
  const isFirst = userCount === 0
  const role = isFirst ? 'admin' : 'user'
  const isApproved = isFirst

  const id = uuidv4()
  const passwordHash = await bcrypt.hash(password, 12)
  const emailEncrypted = encrypt(email)

  await db.collection('users').insertOne({
    _id: id,
    name,
    email_encrypted: emailEncrypted,
    email_hash: emailHash,
    password_hash: passwordHash,
    plan: 'free',
    role,
    is_active: true,
    is_approved: isApproved,
    max_instances: null,
    avatar_url: null,
    bio: null,
    auth_provider: 'local',
    google_id: null,
    created_at: Math.floor(Date.now() / 1000),
  })

  if (isFirst) {
    const user = { id, name, role, is_approved: true, plan: 'free' }
    const payload = buildTokenPayload(user)
    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)

    const response = NextResponse.json(
      { message: 'Admin account created.', user: { id, name, role }, redirect: '/dashboard' },
      { status: 201 }
    )
    setAuthCookies(response, accessToken, refreshToken)
    return response
  }

  return NextResponse.json(
    {
      message: 'Account created. Waiting for administrator approval.',
      pending: true,
      redirect: '/pending-approval',
    },
    { status: 201 }
  )
}

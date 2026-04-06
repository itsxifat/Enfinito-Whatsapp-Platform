import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const db = await getDb()
  const user = await db.collection('users').findOne(
    { _id: session.sub },
    { projection: { name: 1, email_encrypted: 1, plan: 1, role: 1, is_approved: 1, avatar_url: 1, bio: 1, auth_provider: 1, created_at: 1 } }
  )
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  return NextResponse.json({
    user: {
      id:           user._id,
      name:         user.name,
      email:        decrypt(user.email_encrypted),
      plan:         user.plan,
      role:         user.role,
      isApproved:   Boolean(user.is_approved),
      avatarUrl:    user.avatar_url,
      bio:          user.bio,
      authProvider: user.auth_provider,
      createdAt:    user.created_at,
    }
  })
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'

const schema = z.object({
  name: z.string().min(2).max(80).trim().optional(),
  bio:  z.string().max(300).trim().optional(),
})

export async function PATCH(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const { name, bio } = parsed.data
  if (!name && bio === undefined) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })

  const db = await getDb()
  const $set = {}
  if (name !== undefined)        $set.name = name
  if (bio  !== undefined)        $set.bio  = bio || null

  await db.collection('users').updateOne({ _id: session.sub }, { $set })
  return NextResponse.json({ message: 'Profile updated.' })
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const db = await getDb()
  const user = await db.collection('users').findOne(
    { _id: session.sub },
    { projection: { name: 1, bio: 1, avatar_url: 1, plan: 1, role: 1, created_at: 1, auth_provider: 1 } }
  )
  if (!user) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

  return NextResponse.json({
    user: { id: user._id, name: user.name, bio: user.bio, avatar_url: user.avatar_url, plan: user.plan, role: user.role, created_at: user.created_at, auth_provider: user.auth_provider }
  })
}

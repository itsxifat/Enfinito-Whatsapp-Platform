import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = z.object({
    currentPassword: z.string().min(1),
    newPassword:     z.string().min(8).max(128),
  }).safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const db = await getDb()
  const user = await db.collection('users').findOne({ _id: session.sub }, { projection: { password_hash: 1 } })
  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password_hash)
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 })

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12)
  await db.collection('users').updateOne({ _id: session.sub }, { $set: { password_hash: newHash } })
  return NextResponse.json({ message: 'Password updated.' })
}

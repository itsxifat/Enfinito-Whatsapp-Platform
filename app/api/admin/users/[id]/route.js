import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession, isAdmin } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'
import { sendApprovalEmail } from '@/lib/email.js'

const patchSchema = z.object({
  is_approved:   z.boolean().optional(),
  is_active:     z.boolean().optional(),
  role:          z.enum(['admin', 'user']).optional(),
  plan:          z.enum(['free', 'pro']).optional(),
  max_instances: z.number().int().min(0).max(1000).nullable().optional(),
  name:          z.string().min(2).max(80).trim().optional(),
})

export async function PATCH(request, { params }) {
  const session = await getSession()
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Missing user id.' }, { status: 400 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const db = await getDb()
  const user = await db.collection('users').findOne({ _id: id })
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  const updates = parsed.data
  const wasNotApproved = !user.is_approved

  const $set = {}
  if (updates.is_approved   !== undefined) $set.is_approved   = updates.is_approved
  if (updates.is_active     !== undefined) $set.is_active     = updates.is_active
  if (updates.role          !== undefined) $set.role          = updates.role
  if (updates.plan          !== undefined) $set.plan          = updates.plan
  if (updates.max_instances !== undefined) $set.max_instances = updates.max_instances
  if (updates.name          !== undefined) $set.name          = updates.name

  if (Object.keys($set).length === 0) {
    return NextResponse.json({ error: 'No fields to update.' }, { status: 400 })
  }

  await db.collection('users').updateOne({ _id: id }, { $set })

  // Send approval email if user just got approved
  if (updates.is_approved && wasNotApproved) {
    try {
      const email = decrypt(user.email_encrypted)
      await sendApprovalEmail(email, user.name)
    } catch { /* best-effort */ }
  }

  const updated = await db.collection('users').findOne(
    { _id: id },
    { projection: { name: 1, plan: 1, role: 1, is_active: 1, is_approved: 1, max_instances: 1 } }
  )
  return NextResponse.json({
    message: 'User updated.',
    user: { id: updated._id, ...updated, _id: undefined },
  })
}

export async function DELETE(request, { params }) {
  const session = await getSession()
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { id } = await params

  // Prevent admin from deleting themselves
  if (id === session.sub) {
    return NextResponse.json({ error: 'Cannot delete your own account.' }, { status: 400 })
  }

  const db = await getDb()
  const user = await db.collection('users').findOne({ _id: id }, { projection: { _id: 1 } })
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  // Soft-delete
  await db.collection('users').updateOne({ _id: id }, { $set: { is_active: false } })
  return NextResponse.json({ message: 'User deleted.' })
}

export async function GET(request, { params }) {
  const session = await getSession()
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { id } = await params
  const db = await getDb()

  const user = await db.collection('users').findOne(
    { _id: id },
    { projection: { name: 1, email_encrypted: 1, plan: 1, role: 1, is_active: 1, is_approved: 1, max_instances: 1, avatar_url: 1, auth_provider: 1, created_at: 1 } }
  )

  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  let email = null
  try { email = decrypt(user.email_encrypted) } catch { /* */ }

  return NextResponse.json({
    user: { id: user._id, name: user.name, email, plan: user.plan, role: user.role, is_active: user.is_active, is_approved: user.is_approved, max_instances: user.max_instances, avatar_url: user.avatar_url, auth_provider: user.auth_provider, created_at: user.created_at }
  })
}

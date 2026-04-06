import { NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { generateApiKey, hashApiKey } from '@/lib/crypto.js'

const createSchema = z.object({
  label:      z.string().min(1).max(80).trim(),
  instanceId: z.string().uuid(),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const db = await getDb()
  const keys = await db.collection('api_keys').aggregate([
    { $match: { user_id: session.sub } },
    {
      $lookup: {
        from: 'whatsapp_instances',
        localField: 'instance_id',
        foreignField: '_id',
        as: 'inst',
      },
    },
    { $unwind: { path: '$inst', preserveNullAndEmptyArrays: true } },
    { $sort: { created_at: -1 } },
  ]).toArray()

  return NextResponse.json({
    keys: keys.map(k => ({
      id:            k._id,
      label:         k.label,
      key_prefix:    k.key_prefix,
      last_used_at:  k.last_used_at,
      is_active:     k.is_active,
      created_at:    k.created_at,
      instance_name: k.inst?.name ?? null,
      phone_number:  k.inst?.phone_number ?? null,
    }))
  })
}

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { label, instanceId } = parsed.data
  const db = await getDb()

  // Verify user owns this instance
  const inst = await db.collection('whatsapp_instances').findOne(
    { _id: instanceId, user_id: session.sub, is_active: true },
    { projection: { _id: 1 } }
  )
  if (!inst) return NextResponse.json({ error: 'Instance not found.' }, { status: 404 })

  // Limit: 10 active keys per instance
  const count = await db.collection('api_keys').countDocuments({ instance_id: instanceId, is_active: true })
  if (count >= 10) return NextResponse.json({ error: 'Maximum 10 active keys per instance.' }, { status: 403 })

  const rawKey = generateApiKey()
  const keyHash = hashApiKey(rawKey)
  const keyPrefix = rawKey.slice(0, 17) // "enf_live_" + 8 chars

  await db.collection('api_keys').insertOne({
    _id:          uuidv4(),
    user_id:      session.sub,
    instance_id:  instanceId,
    label,
    key_hash:     keyHash,
    key_prefix:   keyPrefix,
    last_used_at: null,
    is_active:    true,
    created_at:   Math.floor(Date.now() / 1000),
  })

  // Return the raw key ONCE — never shown again
  return NextResponse.json({ key: rawKey, prefix: keyPrefix, label }, { status: 201 })
}

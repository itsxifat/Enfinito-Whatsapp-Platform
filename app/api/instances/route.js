import { NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { encrypt, generateSecureToken } from '@/lib/crypto.js'

const createSchema = z.object({
  name:          z.string().min(1).max(80).trim(),
  phoneNumberId: z.string().min(1).trim(),
  wabaId:        z.string().min(1).trim(),
  accessToken:   z.string().min(1).trim(),
  appSecret:     z.string().min(1).trim(),
  appId:         z.string().min(1).trim(),
  phoneNumber:   z.string().optional(),
})

const PLAN_LIMITS = { free: 3, pro: 20 }

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const db = await getDb()
  const instances = await db.collection('whatsapp_instances').find(
    { user_id: session.sub, is_active: true },
    { projection: { _id: 1, name: 1, phone_number: 1, is_active: 1, is_connected: 1, created_at: 1, webhook_verify_token: 1 } }
  ).sort({ created_at: -1 }).toArray()

  return NextResponse.json({
    instances: instances.map(i => ({ id: i._id, ...i, _id: undefined }))
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

  const { name, phoneNumberId, wabaId, accessToken, appSecret, appId, phoneNumber } = parsed.data
  const db = await getDb()

  const count = await db.collection('whatsapp_instances').countDocuments({ user_id: session.sub, is_active: true })
  const user = await db.collection('users').findOne({ _id: session.sub }, { projection: { plan: 1, max_instances: 1 } })

  const maxInstances = user?.max_instances != null
    ? user.max_instances
    : (PLAN_LIMITS[user?.plan] ?? PLAN_LIMITS.free)

  if (count >= maxInstances) {
    return NextResponse.json({ error: `Instance limit reached (${maxInstances}).` }, { status: 403 })
  }

  const id = uuidv4()
  const webhookVerifyToken = generateSecureToken(16)

  await db.collection('whatsapp_instances').insertOne({
    _id:                       id,
    user_id:                   session.sub,
    name,
    phone_number:              phoneNumber || null,
    phone_number_id_encrypted: encrypt(phoneNumberId),
    waba_id_encrypted:         encrypt(wabaId),
    access_token_encrypted:    encrypt(accessToken),
    app_secret_encrypted:      encrypt(appSecret),
    app_id_encrypted:          encrypt(appId),
    webhook_verify_token:      webhookVerifyToken,
    is_active:                 true,
    is_connected:              false,
    created_at:                Math.floor(Date.now() / 1000),
  })

  return NextResponse.json({
    message: 'Instance created.',
    instance: { id, name, webhookVerifyToken }
  }, { status: 201 })
}

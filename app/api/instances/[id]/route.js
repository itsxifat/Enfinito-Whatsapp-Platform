import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { encrypt, decrypt } from '@/lib/crypto.js'
import { z } from 'zod'

export async function GET(request, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await params
  const db = await getDb()
  const inst = await db.collection('whatsapp_instances').findOne({
    _id: id, user_id: session.sub, is_active: true
  })

  if (!inst) return NextResponse.json({ error: 'Instance not found.' }, { status: 404 })

  return NextResponse.json({
    instance: {
      id:                 inst._id,
      name:               inst.name,
      phoneNumber:        inst.phone_number,
      phoneNumberId:      decrypt(inst.phone_number_id_encrypted),
      wabaId:             decrypt(inst.waba_id_encrypted),
      appId:              decrypt(inst.app_id_encrypted),
      isConnected:        inst.is_connected,
      webhookVerifyToken: inst.webhook_verify_token,
      createdAt:          inst.created_at,
    }
  })
}

export async function PATCH(request, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await params
  const db = await getDb()
  const inst = await db.collection('whatsapp_instances').findOne(
    { _id: id, user_id: session.sub, is_active: true },
    { projection: { _id: 1 } }
  )
  if (!inst) return NextResponse.json({ error: 'Instance not found.' }, { status: 404 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const schema = z.object({
    name:          z.string().min(1).max(80).optional(),
    phoneNumber:   z.string().optional(),
    phoneNumberId: z.string().min(1).optional(),
    wabaId:        z.string().min(1).optional(),
    appId:         z.string().min(1).optional(),
    accessToken:   z.string().min(1).optional(),
    appSecret:     z.string().min(1).optional(),
  })
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const $set = {}
  if (parsed.data.name          !== undefined) $set.name                          = parsed.data.name
  if (parsed.data.phoneNumber   !== undefined) $set.phone_number                  = parsed.data.phoneNumber
  if (parsed.data.phoneNumberId !== undefined) $set.phone_number_id_encrypted     = encrypt(parsed.data.phoneNumberId)
  if (parsed.data.wabaId        !== undefined) $set.waba_id_encrypted             = encrypt(parsed.data.wabaId)
  if (parsed.data.appId         !== undefined) $set.app_id_encrypted              = encrypt(parsed.data.appId)
  if (parsed.data.accessToken   !== undefined) $set.access_token_encrypted        = encrypt(parsed.data.accessToken)
  if (parsed.data.appSecret     !== undefined) $set.app_secret_encrypted          = encrypt(parsed.data.appSecret)

  if (Object.keys($set).length > 0) {
    await db.collection('whatsapp_instances').updateOne({ _id: id }, { $set })
  }

  return NextResponse.json({ message: 'Instance updated.' })
}

export async function DELETE(request, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await params
  const db = await getDb()
  const inst = await db.collection('whatsapp_instances').findOne(
    { _id: id, user_id: session.sub },
    { projection: { _id: 1 } }
  )
  if (!inst) return NextResponse.json({ error: 'Instance not found.' }, { status: 404 })

  // Soft delete
  await db.collection('whatsapp_instances').updateOne({ _id: id }, { $set: { is_active: false } })
  await db.collection('api_keys').updateMany({ instance_id: id }, { $set: { is_active: false } })

  return NextResponse.json({ message: 'Instance deleted.' })
}

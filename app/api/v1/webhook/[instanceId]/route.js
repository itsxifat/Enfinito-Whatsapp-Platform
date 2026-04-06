import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '@/lib/db.js'
import crypto from 'crypto'
import { decrypt } from '@/lib/crypto.js'

// GET: Meta webhook verification challenge
export async function GET(request, { params }) {
  const { instanceId } = await params
  const { searchParams } = new URL(request.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const db = await getDb()
  const inst = await db.collection('whatsapp_instances').findOne(
    { _id: instanceId, is_active: true },
    { projection: { webhook_verify_token: 1 } }
  )

  if (!inst) return new Response('Not found', { status: 404 })

  if (mode === 'subscribe' && token === inst.webhook_verify_token) {
    return new Response(challenge, { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

// POST: Receive inbound messages from Meta
export async function POST(request, { params }) {
  const { instanceId } = await params
  const db = await getDb()
  const inst = await db.collection('whatsapp_instances').findOne({
    _id: instanceId, is_active: true
  })

  if (!inst) return new Response('Not found', { status: 404 })

  // Verify Meta signature (HMAC-SHA256)
  const appSecret  = decrypt(inst.app_secret_encrypted)
  const signature  = request.headers.get('x-hub-signature-256')
  const rawBody    = await request.text()

  if (appSecret && signature) {
    const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return new Response('Invalid signature', { status: 403 })
    }
  }

  let payload
  try { payload = JSON.parse(rawBody) } catch {
    return new Response('Bad request', { status: 400 })
  }

  try {
    const entry    = payload?.entry?.[0]
    const changes  = entry?.changes?.[0]
    const value    = changes?.value
    const messages = value?.messages

    if (messages?.length) {
      const now = Math.floor(Date.now() / 1000)
      await db.collection('messages_log').insertMany(
        messages.map(msg => ({
          _id:            uuidv4(),
          instance_id:    instanceId,
          direction:      'inbound',
          contact_number: msg.from,
          message_type:   msg.type || 'unknown',
          status:         'received',
          wamid:          msg.id,
          created_at:     now,
        }))
      )

      // Mark instance as connected on first message received
      if (!inst.is_connected) {
        await db.collection('whatsapp_instances').updateOne(
          { _id: instanceId },
          { $set: { is_connected: true } }
        )
      }
    }

    // Handle status updates
    const statuses = value?.statuses
    if (statuses?.length) {
      await Promise.all(
        statuses.map(s =>
          db.collection('messages_log').updateOne({ wamid: s.id }, { $set: { status: s.status } })
        )
      )
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
  }

  return new Response('OK', { status: 200 })
}

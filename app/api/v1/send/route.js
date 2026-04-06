import { NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { validateApiKey } from '@/lib/apiKeyAuth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'

const messageSchema = z.object({
  to:       z.string().min(7).max(20).regex(/^\+?\d{7,20}$/, 'Invalid phone number'),
  type:     z.enum(['text', 'template', 'image', 'document', 'audio', 'video']),
  text:     z.object({ body: z.string().min(1).max(4096), preview_url: z.boolean().optional() }).optional(),
  template: z.object({
    name:       z.string(),
    language:   z.object({ code: z.string() }),
    components: z.array(z.any()).optional(),
  }).optional(),
  image:    z.object({ link: z.string().url(), caption: z.string().optional() }).optional(),
  document: z.object({ link: z.string().url(), caption: z.string().optional(), filename: z.string().optional() }).optional(),
  audio:    z.object({ link: z.string().url() }).optional(),
  video:    z.object({ link: z.string().url(), caption: z.string().optional() }).optional(),
})

export async function POST(request) {
  const auth = await validateApiKey(request)
  if (auth.error) return auth.error

  const { keyRow } = auth

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = messageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({
      error: 'Validation error',
      details: parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    }, { status: 400 })
  }

  const { to, type, ...rest } = parsed.data
  const accessToken   = decrypt(keyRow.access_token_encrypted)
  const phoneNumberId = decrypt(keyRow.phone_number_id_encrypted)

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type:    'individual',
    to: to.replace(/^\+/, ''),
    type,
    ...rest,
  }

  let metaRes, metaData
  try {
    metaRes = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    metaData = await metaRes.json()
  } catch {
    return NextResponse.json({ error: 'Failed to reach WhatsApp API.' }, { status: 502 })
  }

  if (!metaRes.ok) {
    return NextResponse.json({
      error:   'WhatsApp API error',
      code:    metaData?.error?.code,
      message: metaData?.error?.message,
    }, { status: metaRes.status })
  }

  // Log the message (metadata only, no content)
  const db = await getDb()
  await db.collection('messages_log').insertOne({
    _id:            uuidv4(),
    instance_id:    keyRow.instance_id,
    direction:      'outbound',
    contact_number: to,
    message_type:   type,
    status:         'sent',
    wamid:          metaData.messages?.[0]?.id || null,
    created_at:     Math.floor(Date.now() / 1000),
  })

  // Mark instance as connected on first successful send
  if (!keyRow.is_connected) {
    db.collection('whatsapp_instances').updateOne(
      { _id: keyRow.instance_id },
      { $set: { is_connected: true } }
    ).catch(() => {})
  }

  return NextResponse.json({
    success:   true,
    messageId: metaData.messages?.[0]?.id,
    status:    'sent',
  })
}

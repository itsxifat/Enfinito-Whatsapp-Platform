import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'

export async function POST(request, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await params

  const db = await getDb()
  const inst = await db.collection('whatsapp_instances').findOne({
    _id: id, user_id: session.sub, is_active: true,
  })
  if (!inst) return NextResponse.json({ error: 'Instance not found.' }, { status: 404 })

  let body
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { to, type, text, template, image, document, audio, video } = body

  if (!to || !type) {
    return NextResponse.json({ error: 'Missing required fields: to, type.' }, { status: 400 })
  }

  const accessToken   = decrypt(inst.access_token_encrypted)
  const phoneNumberId = decrypt(inst.phone_number_id_encrypted)

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type:    'individual',
    to: String(to).replace(/^\+/, ''),
    type,
    ...(text     && { text }),
    ...(template && { template }),
    ...(image    && { image }),
    ...(document && { document }),
    ...(audio    && { audio }),
    ...(video    && { video }),
  }

  let metaRes, metaData
  try {
    metaRes = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    metaData = await metaRes.json()
  } catch (err) {
    return NextResponse.json({
      success: false,
      error:   'Failed to reach WhatsApp API.',
      detail:  err.message,
    }, { status: 502 })
  }

  if (!metaRes.ok) {
    return NextResponse.json({
      success:       false,
      httpStatus:    metaRes.status,
      error:         metaData?.error?.message  ?? 'Unknown error from Meta',
      code:          metaData?.error?.code     ?? null,
      type:          metaData?.error?.type     ?? null,
      fbtrace_id:    metaData?.error?.fbtrace_id ?? null,
      _debug:        { phoneNumberId, to: payload.to },
      raw:           metaData,
    }, { status: metaRes.status })
  }

  return NextResponse.json({
    success:   true,
    messageId: metaData.messages?.[0]?.id ?? null,
    _debug:    { phoneNumberId, to: payload.to },
    raw:       metaData,
  })
}

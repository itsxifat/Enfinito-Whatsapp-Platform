import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'

// GET ?sync=1 to pull fresh from Meta, otherwise return cache
export async function GET(request, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await params
  const db = await getDb()

  const inst = await db.collection('whatsapp_instances').findOne({
    _id: id, user_id: session.sub, is_active: true,
  })
  if (!inst) return NextResponse.json({ error: 'Instance not found.' }, { status: 404 })

  const shouldSync = new URL(request.url).searchParams.get('sync') === '1'

  if (shouldSync) {
    const accessToken = decrypt(inst.access_token_encrypted)
    const wabaId      = decrypt(inst.waba_id_encrypted)

    let metaRes, metaData
    try {
      metaRes = await fetch(
        `https://graph.facebook.com/v19.0/${wabaId}/message_templates` +
        `?fields=id,name,language,status,category,components&limit=100`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      metaData = await metaRes.json()
    } catch (err) {
      return NextResponse.json({ error: 'Failed to reach Meta API.', detail: err.message }, { status: 502 })
    }

    if (!metaRes.ok) {
      return NextResponse.json({
        error:      metaData?.error?.message ?? 'Meta API error',
        code:       metaData?.error?.code    ?? null,
        fbtrace_id: metaData?.error?.fbtrace_id ?? null,
      }, { status: metaRes.status })
    }

    const fetched = metaData.data ?? []

    // Upsert every template returned by Meta
    await Promise.all(fetched.map(t =>
      db.collection('templates').updateOne(
        { instance_id: id, meta_id: t.id },
        {
          $set: {
            instance_id: id,
            meta_id:     t.id,
            name:        t.name,
            language:    t.language,
            status:      t.status,
            category:    t.category,
            components:  t.components ?? [],
            synced_at:   Math.floor(Date.now() / 1000),
          },
        },
        { upsert: true }
      )
    ))

    // Remove templates deleted from Meta
    if (fetched.length > 0) {
      const metaIds = fetched.map(t => t.id)
      await db.collection('templates').deleteMany({
        instance_id: id,
        meta_id: { $nin: metaIds },
      })
    }

    const all = await db.collection('templates')
      .find({ instance_id: id })
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ templates: all, synced: true, total: all.length })
  }

  // Return cached
  const templates = await db.collection('templates')
    .find({ instance_id: id })
    .sort({ name: 1 })
    .toArray()

  return NextResponse.json({ templates, synced: false, total: templates.length })
}

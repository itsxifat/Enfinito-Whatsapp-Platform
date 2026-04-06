import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'

export async function DELETE(request, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const db = await getDb()
  const key = await db.collection('api_keys').findOne(
    { _id: params.id, user_id: session.sub },
    { projection: { _id: 1 } }
  )
  if (!key) return NextResponse.json({ error: 'Key not found.' }, { status: 404 })

  await db.collection('api_keys').updateOne({ _id: params.id }, { $set: { is_active: false } })
  return NextResponse.json({ message: 'API key revoked.' })
}

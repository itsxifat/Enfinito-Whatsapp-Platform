import { NextResponse } from 'next/server'
import { getSession, isAdmin } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'

export async function GET() {
  const session = await getSession()
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const db = await getDb()

  const rows = await db.collection('users').aggregate([
    {
      $lookup: {
        from: 'whatsapp_instances',
        let: { uid: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$user_id', '$$uid'] }, { $eq: ['$is_active', true] }] } } },
        ],
        as: 'instances',
      },
    },
    {
      $lookup: {
        from: 'api_keys',
        let: { uid: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$user_id', '$$uid'] }, { $eq: ['$is_active', true] }] } } },
        ],
        as: 'keys',
      },
    },
    {
      $lookup: {
        from: 'messages_log',
        let: { iids: { $map: { input: '$instances', as: 'i', in: '$$i._id' } } },
        pipeline: [
          { $match: { $expr: { $in: ['$instance_id', '$$iids'] } } },
        ],
        as: 'messages',
      },
    },
    {
      $addFields: {
        instance_count: { $size: '$instances' },
        api_key_count:  { $size: '$keys' },
        message_count:  { $size: '$messages' },
      },
    },
    { $project: { instances: 0, keys: 0, messages: 0 } },
    { $sort: { created_at: -1 } },
  ]).toArray()

  const users = rows.map(u => ({
    id:             u._id,
    name:           u.name,
    email:          (() => { try { return decrypt(u.email_encrypted) } catch { return null } })(),
    plan:           u.plan,
    role:           u.role,
    is_active:      u.is_active,
    is_approved:    u.is_approved,
    max_instances:  u.max_instances,
    avatar_url:     u.avatar_url,
    auth_provider:  u.auth_provider,
    created_at:     u.created_at,
    instance_count: u.instance_count,
    api_key_count:  u.api_key_count,
    message_count:  u.message_count,
  }))

  return NextResponse.json({ users })
}

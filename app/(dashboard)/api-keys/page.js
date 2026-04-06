import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import ApiKeysClient from './ApiKeysClient.js'

export default async function ApiKeysPage() {
  const session = await getSession()
  const db = await getDb()

  const [rawKeys, instances] = await Promise.all([
    db.collection('api_keys').aggregate([
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
    ]).toArray(),
    db.collection('whatsapp_instances').find(
      { user_id: session.sub, is_active: true },
      { projection: { name: 1 } }
    ).toArray(),
  ])

  const keys = rawKeys.map(k => ({
    id:            k._id,
    label:         k.label,
    key_prefix:    k.key_prefix,
    last_used_at:  k.last_used_at,
    is_active:     k.is_active,
    created_at:    k.created_at,
    instance_name: k.inst?.name ?? null,
    instance_id:   k.inst?._id ?? null,
  }))

  return <ApiKeysClient initialKeys={keys} instances={instances.map(i => ({ id: i._id, name: i.name }))} />
}

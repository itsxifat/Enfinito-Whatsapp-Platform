import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'
import { redirect } from 'next/navigation'
import UsersClient from './UsersClient.js'

export default async function AdminUsersPage() {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/dashboard')

  const db = await getDb()

  const rows = await db.collection('users').aggregate([
    { $match: { is_active: true } },
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
    { $addFields: { instance_count: { $size: '$instances' } } },
    { $project: { instances: 0 } },
    { $sort: { created_at: -1 } },
  ]).toArray()

  const users = rows.map(u => ({
    id:             u._id,
    name:           u.name,
    email:          (() => { try { return decrypt(u.email_encrypted) } catch { return '(encrypted)' } })(),
    plan:           u.plan,
    role:           u.role,
    is_active:      u.is_active,
    is_approved:    u.is_approved,
    max_instances:  u.max_instances,
    avatar_url:     u.avatar_url,
    auth_provider:  u.auth_provider,
    created_at:     u.created_at,
    instance_count: u.instance_count,
  }))

  return <UsersClient users={users} currentUserId={session.sub} />
}

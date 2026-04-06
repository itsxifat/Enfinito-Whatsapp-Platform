import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'
import SettingsClient from './SettingsClient.js'

export default async function SettingsPage() {
  const session = await getSession()
  const db = await getDb()
  const user = await db.collection('users').findOne(
    { _id: session.sub },
    { projection: { name: 1, email_encrypted: 1, plan: 1, created_at: 1 } }
  )

  return <SettingsClient user={{ id: user._id, name: user.name, email: decrypt(user.email_encrypted), plan: user.plan, created_at: user.created_at }} />
}

import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient.js'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const db = await getDb()
  const user = await db.collection('users').findOne(
    { _id: session.sub },
    { projection: { name: 1, email_encrypted: 1, plan: 1, role: 1, bio: 1, avatar_url: 1, auth_provider: 1, created_at: 1 } }
  )

  if (!user) redirect('/login')

  let email = null
  try { email = decrypt(user.email_encrypted) } catch { /* */ }

  return (
    <ProfileClient
      user={{
        id:           user._id,
        name:         user.name,
        email,
        plan:         user.plan,
        role:         user.role,
        bio:          user.bio || '',
        avatarUrl:    user.avatar_url,
        authProvider: user.auth_provider,
        createdAt:    user.created_at,
      }}
    />
  )
}

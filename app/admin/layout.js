import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar.js'

export default async function AdminLayout({ children }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'admin') redirect('/dashboard')

  const db = await getDb()
  const _user = await db.collection('users').findOne(
    { _id: session.sub },
    { projection: { name: 1, role: 1, avatar_url: 1 } }
  )
  const user = _user ? { id: _user._id, name: _user.name, role: _user.role, avatar_url: _user.avatar_url } : null
  if (!user) redirect('/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar user={user} />
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', maxWidth: '100%', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}

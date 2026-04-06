import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar.js'

export default async function DashboardLayout({ children }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const db = await getDb()
  const _user = await db.collection('users').findOne(
    { _id: session.sub },
    { projection: { name: 1, plan: 1, role: 1, is_approved: 1, avatar_url: 1 } }
  )
  const user = _user ? { id: _user._id, name: _user.name, plan: _user.plan, role: _user.role, is_approved: _user.is_approved, avatar_url: _user.avatar_url } : null
  if (!user) redirect('/login')

  // Block unapproved non-admin users
  if (!user.is_approved && user.role !== 'admin') {
    redirect('/pending-approval')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar user={user} />
      <main className="dashboard-main-mobile-pad" style={{
        flex: 1,
        padding: 'clamp(16px, 3vw, 32px)',
        maxWidth: '100%',
        overflowX: 'hidden',
        minWidth: 0,
      }}>
        {children}
      </main>
    </div>
  )
}

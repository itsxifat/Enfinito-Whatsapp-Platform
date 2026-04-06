import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: accent || 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

export default async function AdminPage() {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/dashboard')

  const db = await getDb()
  const now = Math.floor(Date.now() / 1000)

  const [
    totalUsers,
    pendingUsers,
    totalInstances,
    connectedInst,
    totalMessages,
    messagesLast24h,
    totalKeys,
    pending,
  ] = await Promise.all([
    db.collection('users').countDocuments({ is_active: true }),
    db.collection('users').countDocuments({ is_approved: false, is_active: true }),
    db.collection('whatsapp_instances').countDocuments({ is_active: true }),
    db.collection('whatsapp_instances').countDocuments({ is_active: true, is_connected: true }),
    db.collection('messages_log').countDocuments(),
    db.collection('messages_log').countDocuments({ created_at: { $gt: now - 86400 } }),
    db.collection('api_keys').countDocuments({ is_active: true }),
    db.collection('users').find(
      { is_approved: false, is_active: true },
      { projection: { name: 1, created_at: 1, auth_provider: 1 } }
    ).sort({ created_at: -1 }).limit(5).toArray(),
  ])

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Admin Overview
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>System stats and pending approvals</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Total Users"         value={totalUsers} />
        <StatCard label="Pending Approval"    value={pendingUsers} accent={pendingUsers > 0 ? 'var(--yellow)' : undefined} />
        <StatCard label="WhatsApp Instances"  value={totalInstances} sub={`${connectedInst} connected`} />
        <StatCard label="API Keys"            value={totalKeys} />
        <StatCard label="Total Messages"      value={totalMessages} sub={`${messagesLast24h} last 24h`} />
      </div>

      {/* Pending users */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Pending Approvals</h2>
          <Link href="/admin/users" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>
            Manage all users →
          </Link>
        </div>

        {pending.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)', fontSize: '13px' }}>
            No pending approvals ✓
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Sign-up method', 'Registered', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pending.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 12px', color: 'var(--text)', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span className={`badge ${u.auth_provider === 'google' ? 'badge-yellow' : 'badge-gray'}`}>
                      {u.auth_provider === 'google' ? 'Google' : 'Email'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>
                    {new Date(u.created_at * 1000).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <Link href={`/admin/users?highlight=${u._id}`}
                      style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

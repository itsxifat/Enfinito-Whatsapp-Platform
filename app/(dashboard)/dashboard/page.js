import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()
  const db = await getDb()

  const [instances, keyCount, userInstIds] = await Promise.all([
    db.collection('whatsapp_instances').find(
      { user_id: session.sub, is_active: true },
      { projection: { name: 1, phone_number: 1, is_connected: 1 } }
    ).sort({ created_at: -1 }).toArray(),
    db.collection('api_keys').countDocuments({ user_id: session.sub, is_active: true }),
    db.collection('whatsapp_instances').find(
      { user_id: session.sub, is_active: true },
      { projection: { _id: 1 } }
    ).toArray().then(rows => rows.map(r => r._id)),
  ])

  const [msgSent, msgReceived, recentMsgs] = await Promise.all([
    db.collection('messages_log').countDocuments({ instance_id: { $in: userInstIds }, direction: 'outbound' }),
    db.collection('messages_log').countDocuments({ instance_id: { $in: userInstIds }, direction: 'inbound' }),
    db.collection('messages_log').aggregate([
      { $match: { instance_id: { $in: userInstIds } } },
      { $sort: { created_at: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'whatsapp_instances',
          localField: 'instance_id',
          foreignField: '_id',
          as: 'inst',
        },
      },
      { $unwind: { path: '$inst', preserveNullAndEmptyArrays: true } },
    ]).toArray(),
  ])

  const stats = [
    { label: 'Instances',          value: instances.length, icon: '◈', color: 'var(--accent)' },
    { label: 'API Keys',           value: keyCount,         icon: '⌘', color: '#60a5fa' },
    { label: 'Messages Sent',      value: msgSent,          icon: '↑', color: '#a78bfa' },
    { label: 'Messages Received',  value: msgReceived,      icon: '↓', color: '#fb923c' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Overview of your WhatsApp API activity
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)' }}>
                  {s.value}
                </div>
              </div>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: `${s.color}18`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '16px', color: s.color,
              }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Instances */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600 }}>WhatsApp Instances</h2>
            <Link href="/instances" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {instances.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>◈</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>No instances yet</p>
              <Link href="/instances/new" style={{
                background: 'var(--accent)', color: '#000', textDecoration: 'none',
                fontSize: '13px', fontWeight: 600, padding: '8px 16px', borderRadius: '8px',
              }}>Connect WhatsApp</Link>
            </div>
          ) : instances.slice(0, 4).map(inst => (
            <div key={inst._id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{inst.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {inst.phone_number || 'Not configured'}
                </div>
              </div>
              <span className={`badge ${inst.is_connected ? 'badge-green' : 'badge-gray'}`}>
                <span className={inst.is_connected ? 'dot-green' : 'dot-yellow'}></span>
                {inst.is_connected ? 'Active' : 'Setup pending'}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Messages */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Recent Activity</h2>
          {recentMsgs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>◎</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No messages yet</p>
            </div>
          ) : recentMsgs.map(msg => (
            <div key={msg._id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: msg.direction === 'outbound' ? '#a78bfa' : '#fb923c' }}>
                  {msg.direction === 'outbound' ? '↑' : '↓'}
                </span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{msg.contact_number}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '1px' }}>
                    {msg.inst?.name} · {msg.message_type}
                  </div>
                </div>
              </div>
              <span className={`badge ${msg.status === 'delivered' || msg.status === 'sent' ? 'badge-green' : msg.status === 'failed' ? 'badge-red' : 'badge-yellow'}`}>
                {msg.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

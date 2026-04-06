import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import Link from 'next/link'

function timeAgo(ts) {
  if (!ts) return '—'
  const diff = Math.floor((Date.now() / 1000) - ts)
  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default async function DashboardPage() {
  const session = await getSession()
  const db      = await getDb()

  const [instances, keyCount, userInstIds] = await Promise.all([
    db.collection('whatsapp_instances').find(
      { user_id: session.sub, is_active: true },
      { projection: { name: 1, phone_number: 1, is_connected: 1, created_at: 1 } }
    ).sort({ created_at: -1 }).toArray(),
    db.collection('api_keys').countDocuments({ user_id: session.sub, is_active: true }),
    db.collection('whatsapp_instances')
      .find({ user_id: session.sub, is_active: true }, { projection: { _id: 1 } })
      .toArray().then(r => r.map(x => x._id)),
  ])

  const [msgSent, msgReceived, recentMsgs, templateCount] = await Promise.all([
    db.collection('messages_log').countDocuments({ instance_id: { $in: userInstIds }, direction: 'outbound' }),
    db.collection('messages_log').countDocuments({ instance_id: { $in: userInstIds }, direction: 'inbound' }),
    db.collection('messages_log').aggregate([
      { $match: { instance_id: { $in: userInstIds } } },
      { $sort: { created_at: -1 } },
      { $limit: 8 },
      { $lookup: { from: 'whatsapp_instances', localField: 'instance_id', foreignField: '_id', as: 'inst' } },
      { $unwind: { path: '$inst', preserveNullAndEmptyArrays: true } },
    ]).toArray(),
    userInstIds.length
      ? db.collection('templates').countDocuments({ instance_id: { $in: userInstIds }, status: 'APPROVED' })
      : Promise.resolve(0),
  ])

  const connectedCount = instances.filter(i => i.is_connected).length

  const stats = [
    { label: 'Instances',       value: instances.length, sub: `${connectedCount} connected`,  icon: '◈', color: '#25d366', glow: 'rgba(37,211,102,0.15)' },
    { label: 'API Keys',        value: keyCount,         sub: 'active keys',                  icon: '⌘', color: '#60a5fa', glow: 'rgba(96,165,250,0.15)'  },
    { label: 'Sent',            value: msgSent,          sub: 'messages outbound',             icon: '↑', color: '#a78bfa', glow: 'rgba(167,139,250,0.15)' },
    { label: 'Received',        value: msgReceived,      sub: 'messages inbound',              icon: '↓', color: '#fb923c', glow: 'rgba(251,146,60,0.15)'  },
    { label: 'Templates Ready', value: templateCount,    sub: 'approved templates',            icon: '📋', color: '#34d399', glow: 'rgba(52,211,153,0.15)' },
  ]

  const statusColor = { sent: '#a78bfa', delivered: '#25d366', read: '#25d366', received: '#fb923c', failed: '#ef4444' }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Your WhatsApp API at a glance</p>
        </div>
        {instances.length === 0 && (
          <Link href="/instances/new" className="btn-primary" style={{ fontSize: '13px' }}>
            + Connect WhatsApp
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '18px 20px',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${s.color}60, transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: s.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: s.color }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1, marginBottom: '4px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>{s.sub}</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Instances */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>WhatsApp Instances</span>
            <Link href="/instances" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {instances.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>◈</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '14px' }}>No instances connected</p>
                <Link href="/instances/new" style={{ fontSize: '12px', fontWeight: 600, color: '#000', background: 'var(--accent)', padding: '7px 14px', borderRadius: '7px', textDecoration: 'none' }}>
                  Connect WhatsApp
                </Link>
              </div>
            ) : instances.slice(0, 5).map(inst => (
              <Link key={inst._id} href={`/instances/${inst._id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', transition: 'background 0.1s' }}
                onMouseEnter={undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: inst.is_connected ? 'var(--accent)' : '#555', boxShadow: inst.is_connected ? '0 0 6px rgba(37,211,102,0.6)' : 'none', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{inst.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '1px' }}>{inst.phone_number || 'No number set'}</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: inst.is_connected ? 'var(--accent)' : 'var(--text-dim)' }}>
                  {inst.is_connected ? 'Live' : 'Pending'}
                </span>
              </Link>
            ))}
          </div>
          {instances.length > 0 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
              <Link href="/instances/new" style={{ fontSize: '12px', color: 'var(--text-dim)', textDecoration: 'none' }}>
                + Add instance
              </Link>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Recent Activity</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentMsgs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>◎</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No messages yet</p>
              </div>
            ) : recentMsgs.map(msg => (
              <div key={msg._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: msg.direction === 'outbound' ? 'rgba(167,139,250,0.1)' : 'rgba(251,146,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: msg.direction === 'outbound' ? '#a78bfa' : '#fb923c', flexShrink: 0 }}>
                    {msg.direction === 'outbound' ? '↑' : '↓'}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>{msg.contact_number}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '1px' }}>
                      {msg.inst?.name || 'Unknown'} · {msg.message_type}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: statusColor[msg.status] || 'var(--text-dim)' }}>{msg.status}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>{timeAgo(msg.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {[
          { href: '/instances/new',   icon: '◈', label: 'New Instance',   desc: 'Connect a WhatsApp number',   color: '#25d366' },
          { href: '/api-keys',        icon: '⌘', label: 'API Keys',       desc: 'Manage authentication keys',  color: '#60a5fa' },
          { href: '/setup-guide',     icon: '◉', label: 'Setup Guide',    desc: 'Step-by-step walkthrough',    color: '#a78bfa' },
          { href: '/docs',            icon: '◎', label: 'API Docs',       desc: 'View API reference',          color: '#fb923c' },
        ].map(q => (
          <Link key={q.href} href={q.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', textDecoration: 'none', transition: 'border-color 0.15s' }} className="instance-card">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${q.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: q.color, flexShrink: 0 }}>{q.icon}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{q.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{q.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

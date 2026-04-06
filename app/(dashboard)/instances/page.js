import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import Link from 'next/link'

export default async function InstancesPage() {
  const session = await getSession()
  const db = await getDb()
  const instances = await db.collection('whatsapp_instances').find(
    { user_id: session.sub, is_active: true },
    { projection: { name: 1, phone_number: 1, is_connected: 1, is_active: 1, created_at: 1 } }
  ).sort({ created_at: -1 }).toArray()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
            WhatsApp Instances
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage your connected WhatsApp Business numbers
          </p>
        </div>
        <Link href="/instances/new" className="btn-primary">
          + Add instance
        </Link>
      </div>

      {instances.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '60px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>◈</div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No instances yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            Connect your WhatsApp Business number to start sending messages
          </p>
          <Link href="/instances/new" className="btn-primary">
            Connect WhatsApp →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {instances.map(inst => (
            <Link key={inst._id} href={`/instances/${inst._id}`} style={{ textDecoration: 'none' }}>
              <div className="instance-card" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'border-color 0.15s, background 0.15s',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: inst.is_connected ? 'var(--accent-glow)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${inst.is_connected ? 'rgba(37,211,102,0.25)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px',
                  }}>◈</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>
                      {inst.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      {inst.phone_number || 'Phone number not set'} · ID: {inst._id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${inst.is_connected ? 'badge-green' : 'badge-yellow'}`}>
                    <span className={inst.is_connected ? 'dot-green' : 'dot-yellow'}></span>
                    {inst.is_connected ? 'Connected' : 'Setup pending'}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '16px' }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

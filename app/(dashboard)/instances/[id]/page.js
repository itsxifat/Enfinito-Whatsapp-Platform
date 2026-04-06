import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import { decrypt } from '@/lib/crypto.js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import InstanceActions from './InstanceActions.js'
import MessageTester from './MessageTester.js'

export default async function InstanceDetailPage({ params }) {
  const session = await getSession()
  const db = await getDb()
  const { id } = await params

  const inst = await db.collection('whatsapp_instances').findOne({
    _id: id, user_id: session.sub, is_active: true
  })
  if (!inst) notFound()

  const [keys, msgSent, msgReceived] = await Promise.all([
    db.collection('api_keys').find(
      { instance_id: id },
      { projection: { label: 1, key_prefix: 1, last_used_at: 1, is_active: 1, created_at: 1 } }
    ).sort({ created_at: -1 }).toArray(),
    db.collection('messages_log').countDocuments({ instance_id: id, direction: 'outbound' }),
    db.collection('messages_log').countDocuments({ instance_id: id, direction: 'inbound' }),
  ])

  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/api/v1/webhook/${id}`

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '28px' }}>
        <Link href="/instances" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
          ← Back to instances
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em' }}>{inst.name}</h1>
              <span className={`badge ${inst.is_connected ? 'badge-green' : 'badge-yellow'}`}>
                <span className={inst.is_connected ? 'dot-green' : 'dot-yellow'}></span>
                {inst.is_connected ? 'Connected' : 'Setup pending'}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              {inst.phone_number || 'Phone number not configured'}
            </p>
          </div>
          <InstanceActions instanceId={id} />
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link href={`/instances/${id}/templates`} style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:600, color:'#c084fc', background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.25)', borderRadius:'8px', padding:'8px 14px', textDecoration:'none' }}>
          📋 Message Templates
        </Link>
        <Link href={`/instances/${id}/edit`} style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:600, color:'var(--text-muted)', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px 14px', textDecoration:'none' }}>
          ✎ Update Credentials
        </Link>
        <Link href="/api-keys" style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:600, color:'#93c5fd', background:'rgba(96,165,250,0.08)', border:'1px solid rgba(96,165,250,0.2)', borderRadius:'8px', padding:'8px 14px', textDecoration:'none' }}>
          ⌘ API Keys
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Messages Sent',     value: msgSent,     color: '#a78bfa' },
          { label: 'Messages Received', value: msgReceived, color: '#fb923c' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.04em', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Webhook Setup */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Webhook Configuration</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
          Configure this webhook in Meta for Developers → WhatsApp → Configuration to receive inbound messages.
        </p>
        <div style={{ marginBottom: '14px' }}>
          <label className="label">Webhook URL</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input className="input mono" readOnly value={webhookUrl} style={{ fontSize: '12px' }} />
          </div>
        </div>
        <div>
          <label className="label">Verify Token</label>
          <input className="input mono" readOnly value={inst.webhook_verify_token} style={{ fontSize: '12px' }} />
        </div>
        <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.15)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Subscribe to: <strong style={{ color: 'var(--text)' }}>messages</strong> in the Webhook fields section
        </div>
      </div>

      {/* Message Tester */}
      <MessageTester instanceId={id} />

      {/* API Credentials (masked) */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Stored Credentials</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Phone Number ID', value: decrypt(inst.phone_number_id_encrypted) },
            { label: 'WABA ID',         value: decrypt(inst.waba_id_encrypted) },
            { label: 'App ID',          value: decrypt(inst.app_id_encrypted) },
            { label: 'Access Token',    value: '••••••••••••••••' },
            { label: 'App Secret',      value: '••••••••••••••••' },
          ].map(f => (
            <div key={f.label}>
              <label className="label">{f.label}</label>
              <div className="input mono" style={{ fontSize: '12px', color: 'var(--text-muted)', cursor: 'default', userSelect: 'none' }}>
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys for this instance */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600 }}>API Keys</h2>
          <Link href={`/api-keys?instance=${id}`} style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
            + Generate key
          </Link>
        </div>
        {keys.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', textAlign: 'center', padding: '20px 0' }}>
            No API keys yet. Generate one to start sending messages.
          </p>
        ) : keys.map(k => (
          <div key={k._id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{k.label}</div>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                {k.key_prefix}••••••••••••••••
              </div>
            </div>
            <span className={`badge ${k.is_active ? 'badge-green' : 'badge-red'}`}>
              {k.is_active ? 'Active' : 'Revoked'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

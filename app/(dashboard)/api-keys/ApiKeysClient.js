'use client'
import { useState } from 'react'

function timeAgo(ts) {
  if (!ts) return 'Never'
  const d = new Date(ts * 1000)
  const diff = Math.floor((Date.now() - d) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString()
}

export default function ApiKeysClient({ initialKeys, instances }) {
  const [keys, setKeys] = useState(initialKeys)
  const [form, setForm] = useState({ label: '', instanceId: instances[0]?.id || '' })
  const [newKey, setNewKey] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [revoking, setRevoking] = useState(null)

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setNewKey(null)
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setNewKey(data.key)
      // Refresh list
      const listRes = await fetch('/api/keys')
      const listData = await listRes.json()
      setKeys(listData.keys)
      setForm(f => ({ ...f, label: '' }))
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRevoke(id) {
    setRevoking(id)
    try {
      await fetch(`/api/keys/${id}`, { method: 'DELETE' })
      setKeys(k => k.map(key => key.id === id ? { ...key, is_active: 0 } : key))
    } finally {
      setRevoking(null)
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(newKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>API Keys</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Generate keys to authenticate your apps with the Enfinito API
        </p>
      </div>

      {/* Generate form */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Generate new key</h2>
        {instances.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '16px 0' }}>
            You need to <a href="/instances/new" style={{ color: 'var(--accent)' }}>create a WhatsApp instance</a> first.
          </div>
        ) : (
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: '200px' }}>
              <label className="label">Label</label>
              <input className="input" placeholder="e.g. Production App" value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="label">Instance</label>
              <select className="input" value={form.instanceId}
                onChange={e => setForm(f => ({ ...f, instanceId: e.target.value }))} required>
                {instances.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Generating...' : '+ Generate key'}
            </button>
          </form>
        )}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', fontSize: '13px', color: 'var(--red)' }}>
            {error}
          </div>
        )}
      </div>

      {/* Show newly created key */}
      {newKey && (
        <div style={{
          background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.3)',
          borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', marginBottom: '10px' }}>
            ✓ Key generated — copy it now. It will never be shown again.
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <code className="mono" style={{
              flex: 1, background: '#0a0a0a', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', color: 'var(--text)',
              border: '1px solid var(--border)', wordBreak: 'break-all',
            }}>{newKey}</code>
            <button onClick={copyKey} className="btn-ghost" style={{ padding: '10px 16px', flexShrink: 0 }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Keys list */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        {keys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
            No API keys yet. Generate one above.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Label', 'Key', 'Instance', 'Last used', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((k, i) => (
                <tr key={k.id} style={{ borderBottom: i < keys.length - 1 ? '1px solid var(--border-subtle)' : 'none', opacity: k.is_active ? 1 : 0.5 }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 500 }}>{k.label}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <code className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', background: '#0d0d0d', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      {k.key_prefix}••••••••••••
                    </code>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{k.instance_name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-dim)' }}>{timeAgo(k.last_used_at)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${k.is_active ? 'badge-green' : 'badge-red'}`}>
                      {k.is_active ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {k.is_active && (
                      <button onClick={() => handleRevoke(k.id)} disabled={revoking === k.id} className="btn-danger" style={{ padding: '5px 12px', fontSize: '12px' }}>
                        {revoking === k.id ? '...' : 'Revoke'}
                      </button>
                    )}
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

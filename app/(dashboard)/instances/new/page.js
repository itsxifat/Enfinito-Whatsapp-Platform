'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function Field({ label, type = 'text', placeholder, hint, value, onChange }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label className="label">{label}</label>
      {hint && <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>{hint}</div>}
      <input className="input mono" type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  )
}

export default function NewInstancePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', phoneNumberId: '', wabaId: '',
    accessToken: '', appSecret: '', appId: '', phoneNumber: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push(`/instances/${data.instance.id}`)
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/instances" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
          {'<-'} Back to instances
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginTop: '16px', marginBottom: '6px' }}>
          Connect WhatsApp Instance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Enter your WhatsApp Business API credentials from Meta for Developers
        </p>
      </div>

      <div style={{
        background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.15)',
        borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--accent)' }}>Where to find these credentials:</strong><br />
        Go to <strong>Meta for Developers -&gt; Your App -&gt; WhatsApp -&gt; API Setup</strong><br />
        Phone Number ID and WABA ID are shown there. Access token from System User in Business Manager.
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <Field
            label="Instance name *"
            placeholder="e.g. My Shop Bot"
            hint="A friendly name to identify this connection"
            value={form.name}
            onChange={set('name')}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field
              label="Phone Number *"
              placeholder="+1234567890"
              hint="Your WhatsApp business number"
              value={form.phoneNumber}
              onChange={set('phoneNumber')}
            />
            <Field
              label="App ID *"
              placeholder="12345678901234"
              hint="Meta App ID"
              value={form.appId}
              onChange={set('appId')}
            />
          </div>

          <Field
            label="Phone Number ID *"
            placeholder="1234567890123456"
            hint="Found in WhatsApp -&gt; API Setup"
            value={form.phoneNumberId}
            onChange={set('phoneNumberId')}
          />
          <Field
            label="WhatsApp Business Account ID *"
            placeholder="1234567890123456"
            hint="WABA ID in WhatsApp -&gt; API Setup"
            value={form.wabaId}
            onChange={set('wabaId')}
          />
          <Field
            label="Permanent Access Token *"
            type="password"
            placeholder="EAAxxxxxxx..."
            hint="Generate from Business Manager -&gt; System Users"
            value={form.accessToken}
            onChange={set('accessToken')}
          />
          <Field
            label="App Secret *"
            type="password"
            placeholder="abc123..."
            hint="Found in App Settings -&gt; Basic"
            value={form.appSecret}
            onChange={set('appSecret')}
          />

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: 'var(--red)',
            }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save instance ->'}
            </button>
            <Link href="/instances" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

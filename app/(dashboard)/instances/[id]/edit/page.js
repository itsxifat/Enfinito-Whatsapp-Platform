'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

function Field({ label, hint, placeholder, value, onChange, type = 'text', mono = true }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label className="label">{label}</label>
      {hint && <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>{hint}</div>}
      <input
        className={mono ? 'input mono' : 'input'}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ fontSize: '13px' }}
      />
    </div>
  )
}

export default function EditInstancePage() {
  const router = useRouter()
  const { id } = useParams()

  const [form, setForm] = useState({
    name: '', phoneNumber: '', phoneNumberId: '',
    wabaId: '', appId: '', accessToken: '', appSecret: '',
  })
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')

  useEffect(() => {
    fetch(`/api/instances/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.instance) {
          setForm(f => ({
            ...f,
            name:          data.instance.name          ?? '',
            phoneNumber:   data.instance.phoneNumber   ?? '',
            phoneNumberId: data.instance.phoneNumberId ?? '',
            wabaId:        data.instance.wabaId        ?? '',
            appId:         data.instance.appId         ?? '',
          }))
        }
      })
      .finally(() => setLoadingData(false))
  }, [id])

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    // Only send fields that are filled in — empty secret fields mean "don't change"
    const body = {
      name:          form.name,
      phoneNumber:   form.phoneNumber,
      phoneNumberId: form.phoneNumberId,
      wabaId:        form.wabaId,
      appId:         form.appId,
      ...(form.accessToken && { accessToken: form.accessToken }),
      ...(form.appSecret   && { appSecret:   form.appSecret }),
    }

    try {
      const res  = await fetch(`/api/instances/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Update failed.'); return }
      setSuccess('Credentials updated successfully.')
      setForm(f => ({ ...f, accessToken: '', appSecret: '' }))
      setTimeout(() => router.push(`/instances/${id}`), 1200)
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  if (loadingData) {
    return (
      <div style={{ color: 'var(--text-dim)', fontSize: '14px', padding: '40px 0' }}>Loading...</div>
    )
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      {/* Back nav */}
      <div style={{ marginBottom: '28px' }}>
        <Link href={`/instances/${id}`} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
          ← Back to instance
        </Link>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', marginTop: '16px', marginBottom: '4px' }}>
          Update Credentials
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          All fields are pre-filled with current values. Leave Access Token and App Secret blank to keep them unchanged.
        </p>
      </div>

      {/* Helper banner */}
      <div style={{
        background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.15)',
        borderRadius: '10px', padding: '14px 18px', marginBottom: '24px',
        fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--accent)' }}>Where to find each value in Meta for Developers:</strong>
        <ul style={{ margin: '8px 0 0', paddingLeft: '18px', lineHeight: 2 }}>
          <li><strong style={{ color: 'var(--text)' }}>Phone Number ID</strong> — WhatsApp → API Setup → select your number → shown below the dropdown</li>
          <li><strong style={{ color: 'var(--text)' }}>WABA ID</strong> — WhatsApp → API Setup → "WhatsApp Business Account ID"</li>
          <li><strong style={{ color: 'var(--text)' }}>App ID</strong> — Settings → Basic → top of page</li>
          <li><strong style={{ color: 'var(--text)' }}>App Secret</strong> — Settings → Basic → click Show</li>
          <li><strong style={{ color: 'var(--text)' }}>Access Token</strong> — WhatsApp → API Setup → Generate (or Business Manager → System Users)</li>
        </ul>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
        <form onSubmit={handleSubmit}>

          {/* Name + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field
              label="Instance name"
              placeholder="My Shop Bot"
              mono={false}
              value={form.name}
              onChange={set('name')}
            />
            <Field
              label="Phone number"
              placeholder="+1234567890"
              hint="With country code"
              value={form.phoneNumber}
              onChange={set('phoneNumber')}
            />
          </div>

          {/* IDs */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)', paddingTop: '18px',
            marginBottom: '4px', fontSize: '12px', fontWeight: 600,
            color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>Meta IDs</div>

          <Field
            label="Phone Number ID"
            placeholder="e.g. 123456789012345"
            hint="15–16 digit number from WhatsApp → API Setup"
            value={form.phoneNumberId}
            onChange={set('phoneNumberId')}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field
              label="WABA ID"
              placeholder="e.g. 987654321098765"
              value={form.wabaId}
              onChange={set('wabaId')}
            />
            <Field
              label="App ID"
              placeholder="e.g. 1234567890123456"
              value={form.appId}
              onChange={set('appId')}
            />
          </div>

          {/* Secrets */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)', paddingTop: '18px',
            marginBottom: '4px', fontSize: '12px', fontWeight: 600,
            color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>Secrets (leave blank to keep current)</div>

          <Field
            label="Access Token"
            type="password"
            placeholder="Leave blank to keep current token"
            hint="EAAxxxxxxx... — only fill in if you want to replace it"
            value={form.accessToken}
            onChange={set('accessToken')}
          />
          <Field
            label="App Secret"
            type="password"
            placeholder="Leave blank to keep current secret"
            hint="Only fill in if you want to replace it"
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

          {success && (
            <div style={{
              background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: 'var(--accent)',
            }}>✓ {success}</div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <Link href={`/instances/${id}`} className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

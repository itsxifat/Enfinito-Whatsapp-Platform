'use client'
import { useState } from 'react'

export default function SettingsClient({ user }) {
  const [name, setName] = useState(user.name)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [nameMsg, setNameMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function saveName(e) {
    e.preventDefault()
    setLoading(true)
    setNameMsg('')
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      setNameMsg(res.ok ? '✓ Name updated.' : data.error)
    } finally { setLoading(false) }
  }

  async function savePassword(e) {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) { setPwMsg('Passwords do not match.'); return }
    if (passwords.new.length < 8) { setPwMsg('Minimum 8 characters.'); return }
    setLoading(true)
    setPwMsg('')
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      })
      const data = await res.json()
      setPwMsg(res.ok ? '✓ Password updated.' : data.error)
      if (res.ok) setPasswords({ current: '', new: '', confirm: '' })
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your account</p>
      </div>

      {/* Profile */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Profile</h2>
        <form onSubmit={saveName}>
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} required minLength={2} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="label">Email</label>
            <input className="input" value={user.email} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>
          {nameMsg && (
            <div style={{ fontSize: '13px', marginBottom: '12px', color: nameMsg.startsWith('✓') ? 'var(--accent)' : 'var(--red)' }}>
              {nameMsg}
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>Save changes</button>
        </form>
      </div>

      {/* Password */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Change Password</h2>
        <form onSubmit={savePassword}>
          {['current', 'new', 'confirm'].map(field => (
            <div key={field} style={{ marginBottom: '16px' }}>
              <label className="label">
                {field === 'current' ? 'Current password' : field === 'new' ? 'New password' : 'Confirm new password'}
              </label>
              <input className="input" type="password" placeholder="••••••••"
                value={passwords[field]}
                onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))} required />
            </div>
          ))}
          {pwMsg && (
            <div style={{ fontSize: '13px', marginBottom: '12px', color: pwMsg.startsWith('✓') ? 'var(--accent)' : 'var(--red)' }}>
              {pwMsg}
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>Update password</button>
        </form>
      </div>

      {/* Plan info */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Plan</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, textTransform: 'capitalize' }}>{user.plan}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {user.plan === 'free' ? '3 instances · 10 keys/instance · 100 req/min' : '20 instances · Unlimited keys'}
            </div>
          </div>
          {user.plan === 'free' && (
            <span style={{
              background: 'var(--accent)', color: '#000', padding: '8px 16px',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>Upgrade to Pro</span>
          )}
        </div>
      </div>
    </div>
  )
}

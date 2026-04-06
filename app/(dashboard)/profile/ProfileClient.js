'use client'
import { useState, useRef } from 'react'

export default function ProfileClient({ user }) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl)
  const [profileMsg, setProfileMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [pwSaving, setPwSaving] = useState(false)

  const fileRef = useRef(null)

  async function saveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setProfileMsg('')
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      })
      const data = await res.json()
      setProfileMsg(res.ok ? '✓ Profile saved.' : (data.error || 'Failed.'))
    } finally { setSaving(false) }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    setProfileMsg('')
    try {
      const form = new FormData()
      form.append('avatar', file)
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        setAvatarUrl(data.avatarUrl + '?t=' + Date.now())
        setProfileMsg('✓ Avatar updated.')
      } else {
        setProfileMsg(data.error || 'Upload failed.')
      }
    } finally {
      setAvatarUploading(false)
    }
  }

  async function removeAvatar() {
    if (!confirm('Remove your profile picture?')) return
    setAvatarUploading(true)
    try {
      const res = await fetch('/api/profile/avatar', { method: 'DELETE' })
      if (res.ok) setAvatarUrl(null)
    } finally { setAvatarUploading(false) }
  }

  async function savePassword(e) {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) { setPwMsg('Passwords do not match.'); return }
    if (passwords.new.length < 8) { setPwMsg('Minimum 8 characters.'); return }
    setPwSaving(true)
    setPwMsg('')
    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      })
      const data = await res.json()
      setPwMsg(res.ok ? '✓ Password updated.' : (data.error || 'Failed.'))
      if (res.ok) setPasswords({ current: '', new: '', confirm: '' })
    } finally { setPwSaving(false) }
  }

  const initials = name?.[0]?.toUpperCase() || 'U'

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>My Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your personal information and security</p>
      </div>

      {/* Avatar + profile info */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Profile Information</h2>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar"
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
            ) : (
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: 700, color: '#000',
              }}>
                {initials}
              </div>
            )}
            {avatarUploading && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: '#fff',
              }}>…</div>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => fileRef.current?.click()}
                className="btn-ghost"
                disabled={avatarUploading}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                {avatarUrl ? 'Change photo' : 'Upload photo'}
              </button>
              {avatarUrl && (
                <button
                  onClick={removeAvatar}
                  className="btn-danger"
                  disabled={avatarUploading}
                  style={{ fontSize: '12px' }}
                >
                  Remove
                </button>
              )}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
              JPEG, PNG or WebP · max 2 MB
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <form onSubmit={saveProfile}>
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Full name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} required minLength={2} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Email</label>
            <input className="input" value={user.email || ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            {user.authProvider === 'google' && (
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                Managed by Google — changes must be made in your Google account.
              </p>
            )}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="label">Bio <span style={{ color: 'var(--text-dim)' }}>(optional)</span></label>
            <textarea
              className="input"
              placeholder="A short bio about yourself…"
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={300}
              rows={3}
              style={{ resize: 'vertical' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', textAlign: 'right' }}>
              {bio.length}/300
            </div>
          </div>

          {profileMsg && (
            <div style={{ fontSize: '13px', marginBottom: '12px', color: profileMsg.startsWith('✓') ? 'var(--accent)' : 'var(--red)' }}>
              {profileMsg}
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Account Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Plan', value: user.plan.charAt(0).toUpperCase() + user.plan.slice(1) },
            { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
            { label: 'Sign-in method', value: user.authProvider === 'google' ? 'Google' : 'Email & password' },
            { label: 'Member since', value: new Date(user.createdAt * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--bg)', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Change password — only for local accounts */}
      {user.authProvider === 'local' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Change Password</h2>
          <form onSubmit={savePassword}>
            {[
              { key: 'current', label: 'Current password' },
              { key: 'new', label: 'New password' },
              { key: 'confirm', label: 'Confirm new password' },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <label className="label">{label}</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  required
                  minLength={key === 'current' ? 1 : 8}
                  autoComplete={key === 'current' ? 'current-password' : 'new-password'}
                />
              </div>
            ))}
            {pwMsg && (
              <div style={{ fontSize: '13px', marginBottom: '12px', color: pwMsg.startsWith('✓') ? 'var(--accent)' : 'var(--red)' }}>
                {pwMsg}
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={pwSaving}>
              {pwSaving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) setStatus('Invalid or missing reset token.')
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('')
    if (form.password !== form.confirm) { setStatus('Passwords do not match.'); return }
    if (form.password.length < 8) { setStatus('Password must be at least 8 characters.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setStatus(data.error || 'Reset failed.'); return }
      setDone(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch {
      setStatus('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'var(--accent)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '22px', color: '#000',
          margin: '0 auto 16px',
        }}>✦</div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Choose a new password
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Make it strong — at least 8 characters
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '28px',
      }}>
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600, marginBottom: '8px' }}>Password updated!</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Redirecting you to sign in…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="label">New password</label>
              <input
                className="input"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={8}
                autoComplete="new-password"
                disabled={!token}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label className="label">Confirm password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                required
                autoComplete="new-password"
                disabled={!token}
              />
            </div>
            {status && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
                fontSize: '13px', color: 'var(--red)',
              }}>{status}</div>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !token}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to sign in
        </Link>
      </p>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading…</div>}>
      <ResetForm />
    </Suspense>
  )
}

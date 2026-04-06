'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      await res.json()
      setSent(true)
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
          Reset your password
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '28px',
      }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📬</div>
            <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600, marginBottom: '8px' }}>Check your inbox</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              If an account exists for <strong style={{ color: 'var(--text)' }}>{email}</strong>,
              a reset link has been sent. It expires in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            {status && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
                fontSize: '13px', color: 'var(--red)',
              }}>{status}</div>
            )}
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
        Remember it?{' '}
        <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          Back to sign in →
        </Link>
      </p>
    </div>
  )
}

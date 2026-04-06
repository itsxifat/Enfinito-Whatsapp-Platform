'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed.'); return }
      // Redirect to the URL indicated by the API (dashboard for admin, pending for others)
      router.push(data.redirect || '/pending-approval')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogle() {
    window.location.href = '/api/auth/google'
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'var(--accent)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '22px', color: '#000',
          margin: '0 auto 16px',
        }}>✦</div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Create your account
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Start sending messages in minutes
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '28px',
      }}>
        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogle}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', padding: '10px 16px', borderRadius: '8px',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            marginBottom: '20px', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#555'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706 0-.589.102-1.166.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Full name</label>
            <input className="input" type="text" placeholder="Your name"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required minLength={2} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@company.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required autoComplete="email" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Min. 8 characters"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required minLength={8} autoComplete="new-password" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label className="label">Confirm password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              required autoComplete="new-password" />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: 'var(--red)',
            }}>{error}</div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>
      </div>

      {/* Notice about approval */}
      <div style={{
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
        borderRadius: '10px', padding: '12px 16px', marginTop: '16px',
        fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6,
      }}>
        ℹ️ New accounts require administrator approval before you can access the platform.
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          Sign in →
        </Link>
      </p>
    </div>
  )
}

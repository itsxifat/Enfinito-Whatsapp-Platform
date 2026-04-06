'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const GOOGLE_ERRORS = {
  google_denied: 'Google sign-in was cancelled.',
  invalid_state: 'Security check failed. Please try again.',
  no_code: 'Google did not return an authorization code.',
  token_exchange: 'Failed to complete Google sign-in. Please try again.',
  userinfo_failed: 'Could not retrieve your Google profile. Please try again.',
  oauth_not_configured: 'Google sign-in is not configured on this server.',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const err = searchParams.get('error')
    if (err && GOOGLE_ERRORS[err]) setError(GOOGLE_ERRORS[err])
  }, [searchParams])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setPending(false)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.pending) { setPending(true); setError(data.error || 'Pending approval.'); return }
        setError(data.error || 'Login failed.')
        return
      }
      router.push(data.user?.role === 'admin' ? '/admin' : '/dashboard')
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
    <div style={{ width: '100%', maxWidth: '400px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'var(--accent)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '22px', color: '#000',
          margin: '0 auto 16px',
        }}>✦</div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Sign in to your Enfinito account
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
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              autoComplete="email"
            />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="label" style={{ margin: 0 }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              background: pending ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${pending ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: '8px', padding: '10px 14px', margin: '16px 0',
              fontSize: '13px', color: pending ? 'var(--yellow)' : 'var(--red)',
            }}>
              {error}
              {pending && (
                <span> <Link href="/pending-approval" style={{ color: 'var(--yellow)', fontWeight: 600 }}>Learn more →</Link></span>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: error ? 0 : '16px' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          Create one →
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

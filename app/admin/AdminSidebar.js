'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const nav = [
  { href: '/admin', label: 'Overview', icon: '▦', exact: true },
  { href: '/admin/users', label: 'Users', icon: '◉' },
  { href: '/dashboard', label: '← App Dashboard', icon: '◈' },
]

export default function AdminSidebar({ user }) {
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#0d0d0d',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px', flexShrink: 0,
          }}>✦</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Admin Panel
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '1px' }}>Enfinito</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {nav.map(item => {
          const active = item.exact ? pathname === item.href : (pathname === item.href || pathname.startsWith(item.href + '/'))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '8px', marginBottom: '2px',
              fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              background: active ? 'var(--accent-glow)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              border: active ? '1px solid rgba(37,211,102,0.15)' : '1px solid transparent',
              transition: 'all 0.12s ease',
            }}>
              <span style={{ fontSize: '14px', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '0 12px', borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px', borderRadius: '8px', background: 'var(--bg-card)',
          marginBottom: '8px',
        }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" style={{
              width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
            }} />
          ) : (
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: '#000', flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--yellow)', marginTop: '1px' }}>
              Administrator
            </div>
          </div>
        </div>
        <button onClick={handleLogout} disabled={loggingOut} style={{
          width: '100%', padding: '8px', borderRadius: '8px',
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--text-dim)', fontSize: '12px', cursor: 'pointer',
          transition: 'all 0.12s ease',
        }}
          onMouseEnter={e => { e.target.style.color = 'var(--red)'; e.target.style.borderColor = 'rgba(239,68,68,0.3)' }}
          onMouseLeave={e => { e.target.style.color = 'var(--text-dim)'; e.target.style.borderColor = 'var(--border)' }}
        >
          {loggingOut ? 'Signing out...' : '↩ Sign out'}
        </button>
      </div>
    </aside>
  )
}

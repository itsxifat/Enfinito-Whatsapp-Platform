'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const userNav = [
  { href: '/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/instances', label: 'Instances', icon: '◈' },
  { href: '/api-keys', label: 'API Keys', icon: '⌘' },
  { href: '/setup-guide', label: 'Setup Guide', icon: '◉', highlight: true },
  { href: '/docs', label: 'API Docs', icon: '◎' },
  { href: '/profile', label: 'Profile', icon: '○' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
]

export default function Sidebar({ user }) {
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const navItems = user?.role === 'admin'
    ? [...userNav, { href: '/admin', label: 'Admin Panel', icon: '◆' }]
    : userNav

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
              Enfinito
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '1px' }}>WhatsApp API</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const isAdmin = item.href === '/admin'
          const isHighlight = item.highlight && !active
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '8px', marginBottom: '2px',
              fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              background: active ? (isAdmin ? 'rgba(245,158,11,0.1)' : 'var(--accent-glow)') : 'transparent',
              color: active ? (isAdmin ? 'var(--yellow)' : 'var(--accent)') : 'var(--text-muted)',
              border: active ? `1px solid ${isAdmin ? 'rgba(245,158,11,0.2)' : 'rgba(37,211,102,0.15)'}` : '1px solid transparent',
              transition: 'all 0.12s ease',
            }}>
              <span style={{ fontSize: '14px', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
              {isAdmin && (
                <span style={{
                  marginLeft: 'auto', fontSize: '9px', fontWeight: 700,
                  background: 'rgba(245,158,11,0.15)', color: 'var(--yellow)',
                  padding: '2px 5px', borderRadius: '4px', letterSpacing: '0.05em',
                }}>ADMIN</span>
              )}
              {isHighlight && (
                <span style={{
                  marginLeft: 'auto', fontSize: '9px', fontWeight: 700,
                  background: 'rgba(37,211,102,0.15)', color: 'var(--accent)',
                  padding: '2px 5px', borderRadius: '4px', letterSpacing: '0.05em',
                }}>NEW</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '0 12px', borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '8px' }}>
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px', borderRadius: '8px', background: 'var(--bg-card)',
            marginBottom: '8px', cursor: 'pointer',
            border: '1px solid transparent', transition: 'border-color 0.12s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" style={{
                width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: '#000', flexShrink: 0,
              }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '1px' }}>
                {user?.role === 'admin' ? (
                  <span style={{ color: 'var(--yellow)' }}>admin</span>
                ) : (
                  `${user?.plan || 'free'} plan`
                )}
              </div>
            </div>
          </div>
        </Link>
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

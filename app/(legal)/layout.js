import Link from 'next/link'

export default function LegalLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          padding: '0 24px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '15px', color: '#000', flexShrink: 0,
            }}>✦</div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Enfinito
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: '4px' }}>
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/login', label: 'Sign in', primary: true },
            ].map(({ href, label, primary }) => (
              <Link key={href} href={href} style={{
                padding: '6px 14px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                background: primary ? 'var(--accent)' : 'transparent',
                color: primary ? '#000' : 'var(--text-muted)',
                border: primary ? 'none' : '1px solid transparent',
                transition: 'all 0.12s ease',
              }}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
        {children}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 24px',
        marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '6px',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '11px', color: '#000',
            }}>✦</div>
            <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              © {new Date().getFullYear()} Enfinito. All rights reserved.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontSize: '13px', color: 'var(--text-dim)', textDecoration: 'none',
              }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

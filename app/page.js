import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px', color: '#000',
          }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>Enfinito</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/login" style={{
            color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px',
            padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)',
            transition: 'all 0.15s',
          }}>Sign in</Link>
          <Link href="/register" style={{
            background: 'var(--accent)', color: '#000', textDecoration: 'none',
            fontSize: '14px', fontWeight: 600, padding: '8px 18px', borderRadius: '8px',
            transition: 'all 0.15s',
          }}>Get started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: '900px', margin: '0 auto', padding: '100px 48px 80px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'var(--accent-glow)', border: '1px solid rgba(37,211,102,0.25)',
          borderRadius: '20px', padding: '6px 14px', marginBottom: '32px',
          fontSize: '12px', color: 'var(--accent)', fontWeight: 600,
        }}>
          <span className="dot-green"></span>
          WhatsApp Business API Gateway
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.04em', marginBottom: '24px',
          background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          One API for all your<br />WhatsApp messaging
        </h1>
        <p style={{
          fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.7,
          maxWidth: '560px', margin: '0 auto 40px',
        }}>
          Connect your WhatsApp Business number once. Use it across all your apps
          with a single secure API key. No repeated setup. No complexity.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{
            background: 'var(--accent)', color: '#000', textDecoration: 'none',
            fontSize: '15px', fontWeight: 700, padding: '14px 28px', borderRadius: '10px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}>Start for free →</Link>
          <Link href="/docs" style={{
            background: 'transparent', color: 'var(--text-muted)', textDecoration: 'none',
            fontSize: '15px', fontWeight: 500, padding: '14px 28px', borderRadius: '10px',
            border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}>View API docs</Link>
        </div>
      </section>

      {/* Code preview */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '0 48px 80px' }}>
        <div style={{
          background: '#0d0d0d', border: '1px solid var(--border)',
          borderRadius: '14px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', borderBottom: '1px solid var(--border)',
            background: '#111',
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
            <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
              send-message.js
            </span>
          </div>
          <pre style={{
            padding: '24px', margin: 0, fontSize: '13px', lineHeight: 1.7,
            fontFamily: 'monospace', overflowX: 'auto', color: '#ccc',
          }}>{`const response = await fetch('https://yourdomain.com/api/v1/send', {
  method: 'POST',
  headers: {
    'X-API-Key': 'enf_live_xxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+1234567890',
    type: 'text',
    text: { body: 'Hello from Enfinito! 👋' }
  })
})

const data = await response.json()
// { success: true, messageId: 'wamid.xxx', status: 'sent' }`}</pre>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px 100px' }}>
        <h2 style={{
          fontSize: '28px', fontWeight: 700, textAlign: 'center',
          marginBottom: '48px', letterSpacing: '-0.03em',
        }}>Everything you need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🔑', title: 'API Key Management', desc: 'Generate, rotate, and revoke API keys. One key per WhatsApp instance.' },
            { icon: '🔒', title: 'End-to-End Encrypted', desc: 'All credentials encrypted with AES-256-GCM. Never stored in plain text.' },
            { icon: '📨', title: 'Send & Receive', desc: 'Full two-way messaging. Webhooks for inbound messages with signature verification.' },
            { icon: '📊', title: 'Message Logs', desc: 'Track all sent and received messages with delivery status.' },
            { icon: '⚡', title: 'Rate Limited', desc: 'Built-in rate limiting per key to protect your usage and Meta quotas.' },
            { icon: '🌐', title: 'Multi-Instance', desc: 'Connect multiple WhatsApp numbers and manage them from one dashboard.' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '24px', transition: 'border-color 0.15s',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '24px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '13px', color: 'var(--text-dim)',
      }}>
        <span>© {new Date().getFullYear()} Enfinito. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '13px' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '13px' }}>Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}

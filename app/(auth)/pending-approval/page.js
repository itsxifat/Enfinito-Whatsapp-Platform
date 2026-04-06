export default function PendingApprovalPage() {
  return (
    <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', margin: '0 auto 24px',
      }}>⏳</div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px' }}>
        Account pending approval
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
        Your account has been created and is waiting for an administrator to approve it.
        You&apos;ll receive an email once you&apos;re approved.
      </p>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '20px',
        fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--text)' }}>What happens next?</strong><br />
        An admin will review your registration and grant access to the platform.
        If you need urgent access, contact your administrator directly.
      </div>
      <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-dim)' }}>
        Already approved?{' '}
        <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          Sign in →
        </a>
      </p>
    </div>
  )
}

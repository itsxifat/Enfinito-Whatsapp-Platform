import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Enfinito',
  description: 'How Enfinito collects, uses, and protects your personal information.',
}

const LAST_UPDATED = 'April 6, 2026'
const EFFECTIVE_DATE = 'April 6, 2026'
const CONTACT_EMAIL = 'privacy@enfinito.cloud'

const sections = [
  { id: 'overview', title: '1. Overview' },
  { id: 'information-we-collect', title: '2. Information We Collect' },
  { id: 'how-we-use', title: '3. How We Use Your Information' },
  { id: 'google-api', title: '4. Google API Services' },
  { id: 'data-security', title: '5. Data Security' },
  { id: 'third-party', title: '6. Third-Party Services' },
  { id: 'data-sharing', title: '7. Data Sharing & Disclosure' },
  { id: 'your-rights', title: '8. Your Rights' },
  { id: 'retention', title: '9. Data Retention' },
  { id: 'cookies', title: '10. Cookies & Tokens' },
  { id: 'children', title: '11. Children\'s Privacy' },
  { id: 'changes', title: '12. Changes to This Policy' },
  { id: 'contact', title: '13. Contact Us' },
]

function SectionHeading({ id, title }) {
  return (
    <h2 id={id} style={{
      fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em',
      marginTop: '48px', marginBottom: '16px',
      paddingTop: '24px', borderTop: '1px solid var(--border)',
      color: 'var(--text)',
      scrollMarginTop: '80px',
    }}>
      {title}
    </h2>
  )
}

function SubHeading({ children }) {
  return (
    <h3 style={{
      fontSize: '14px', fontWeight: 700, color: 'var(--text)',
      marginTop: '24px', marginBottom: '10px', letterSpacing: '-0.01em',
    }}>
      {children}
    </h3>
  )
}

function P({ children }) {
  return (
    <p style={{
      fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8,
      marginBottom: '14px',
    }}>
      {children}
    </p>
  )
}

function Ul({ items }) {
  return (
    <ul style={{ margin: '10px 0 16px', padding: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: 'flex', gap: '10px', alignItems: 'flex-start',
          fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8,
          marginBottom: '6px', paddingLeft: '4px',
        }}>
          <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Highlight({ children }) {
  return (
    <div style={{
      background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.15)',
      borderLeft: '3px solid var(--accent)',
      borderRadius: '0 8px 8px 0', padding: '14px 18px',
      fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7,
      marginBottom: '20px',
    }}>
      {children}
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        padding: '60px 0 40px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '8px',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)',
          borderRadius: '20px', padding: '4px 12px', marginBottom: '20px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.04em' }}>
            LEGAL
          </span>
        </div>
        <h1 style={{
          fontSize: '38px', fontWeight: 800, letterSpacing: '-0.04em',
          lineHeight: 1.15, marginBottom: '16px', color: 'var(--text)',
        }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '620px', marginBottom: '24px' }}>
          We built Enfinito with privacy in mind. This policy explains what data we collect, why we collect it,
          and how we keep it safe.
        </p>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Last Updated', value: LAST_UPDATED },
            { label: 'Effective Date', value: EFFECTIVE_DATE },
          ].map(({ label, value }) => (
            <div key={label}>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </span>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginTop: '2px' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', marginTop: '40px' }}>
        {/* Table of Contents — sticky sidebar */}
        <aside className="legal-toc" style={{
          width: '220px', flexShrink: 0,
          position: 'sticky', top: '80px',
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '20px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.06em', marginBottom: '14px' }}>
              CONTENTS
            </div>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} style={{
                display: 'block', fontSize: '12px', color: 'var(--text-muted)',
                textDecoration: 'none', padding: '5px 0',
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'color 0.12s',
                lineHeight: 1.4,
              }}>
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Highlight>
            <strong style={{ color: 'var(--text)' }}>Summary:</strong> Enfinito is a WhatsApp Business API gateway.
            We collect only the data necessary to operate the service. We never sell your data.
            All sensitive credentials are encrypted with AES-256-GCM at rest. You can delete your account at any time.
          </Highlight>

          {/* 1 */}
          <SectionHeading id="overview" title="1. Overview" />
          <P>
            Enfinito (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the Enfinito WhatsApp Business API Gateway platform,
            accessible at our website and associated services (collectively, the &ldquo;Service&rdquo;). This Privacy Policy
            describes how we collect, use, store, and protect your personal information when you use our Service.
          </P>
          <P>
            By using the Service, you agree to the collection and use of information in accordance with this policy.
            If you do not agree to this policy, please do not use the Service.
          </P>

          {/* 2 */}
          <SectionHeading id="information-we-collect" title="2. Information We Collect" />

          <SubHeading>2.1 Account Information</SubHeading>
          <P>When you create an account, we collect:</P>
          <Ul items={[
            'Full name',
            'Email address (stored as an AES-256-GCM encrypted value and a one-way SHA-256 hash for lookup)',
            'Password (hashed with bcrypt, cost factor 12 — the plaintext is never stored)',
            'Profile photo (optional, uploaded by you)',
            'Bio / description (optional)',
          ]} />

          <SubHeading>2.2 Google Sign-In (OAuth 2.0)</SubHeading>
          <P>
            If you choose to sign in with Google, we receive from Google your name, email address, and profile
            photo URL. We store your Google account ID to link the OAuth identity to your Enfinito account.
            We do not store Google access tokens or refresh tokens beyond the authentication flow.
          </P>

          <SubHeading>2.3 WhatsApp Business Credentials</SubHeading>
          <P>
            To connect WhatsApp instances, you provide Meta / WhatsApp Business API credentials (Phone Number ID,
            WhatsApp Business Account ID, Access Token, App Secret, App ID). These are encrypted with AES-256-GCM
            using a server-side key before storage. The plaintext values are only decrypted in memory at the moment
            they are needed to make API calls and are never logged.
          </P>

          <SubHeading>2.4 Usage Data</SubHeading>
          <Ul items={[
            'Message logs: direction (inbound / outbound), recipient phone number, message type, delivery status, WhatsApp message ID (wamid)',
            'API key usage: last-used timestamp',
            'Rate-limiting data: request counts by IP address or API key (ephemeral, cleared on window reset)',
          ]} />

          <SubHeading>2.5 Technical Information</SubHeading>
          <Ul items={[
            'IP address (used for rate limiting and security; not linked to your profile)',
            'HTTP request metadata for security monitoring',
          ]} />

          {/* 3 */}
          <SectionHeading id="how-we-use" title="3. How We Use Your Information" />
          <Ul items={[
            'Provide, operate, and improve the Service',
            'Authenticate your identity and maintain session security',
            'Process and relay WhatsApp messages on your behalf',
            'Generate and validate API keys',
            'Send transactional emails (account approval notifications, password reset links)',
            'Enforce rate limits and prevent abuse',
            'Comply with legal obligations',
          ]} />
          <P>
            We do not use your data for advertising, sell it to third parties, or use it for any purpose
            beyond operating the Service you signed up for.
          </P>

          {/* 4 */}
          <SectionHeading id="google-api" title="4. Google API Services" />
          <Highlight>
            Enfinito&apos;s use of information received from Google APIs adheres to the{' '}
            <a href="https://developers.google.com/terms/api-services-user-data-policy"
              style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>, including the Limited Use requirements.
          </Highlight>
          <P>
            When you authenticate with Google Sign-In, Enfinito requests only the minimum necessary OAuth scopes:
            <code style={{ background: 'var(--bg)', padding: '1px 5px', borderRadius: '4px', fontSize: '13px', color: 'var(--accent)' }}>openid</code>,{' '}
            <code style={{ background: 'var(--bg)', padding: '1px 5px', borderRadius: '4px', fontSize: '13px', color: 'var(--accent)' }}>email</code>, and{' '}
            <code style={{ background: 'var(--bg)', padding: '1px 5px', borderRadius: '4px', fontSize: '13px', color: 'var(--accent)' }}>profile</code>.
          </P>
          <Ul items={[
            'We use data obtained via Google APIs solely to authenticate you and populate your Enfinito profile.',
            'We do not access Gmail, Google Drive, Google Contacts, or any other Google product beyond identity.',
            'Data obtained from Google APIs is not transferred to, shared with, or used by any third parties.',
            'Data obtained from Google APIs is not used for serving advertisements.',
            'Google access tokens are not persisted to our database.',
          ]} />

          {/* 5 */}
          <SectionHeading id="data-security" title="5. Data Security" />
          <P>
            We implement multiple independent layers of protection for your data:
          </P>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px', margin: '16px 0 20px',
          }}>
            {[
              { icon: '🔐', title: 'AES-256-GCM Encryption', desc: 'Email addresses and all WhatsApp credentials are encrypted at rest with AES-256-GCM with a random IV per value.' },
              { icon: '🔑', title: 'bcrypt Password Hashing', desc: 'Passwords are hashed using bcrypt with a cost factor of 12. The plaintext password is never stored or logged.' },
              { icon: '🔒', title: 'HMAC-SHA256 Tokens', desc: 'Password reset tokens are hashed with HMAC-SHA256 keyed by a server secret before storage. They are single-use and expire in 1 hour.' },
              { icon: '🛡️', title: 'JWT Session Tokens', desc: 'Sessions use short-lived JWT access tokens (15 minutes) with 7-day refresh tokens, delivered as httpOnly cookies.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '16px',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
          <P>
            Despite these measures, no transmission over the internet or electronic storage is 100% secure.
            We cannot guarantee absolute security, but we continuously work to protect your information.
          </P>

          {/* 6 */}
          <SectionHeading id="third-party" title="6. Third-Party Services" />

          <SubHeading>6.1 Meta / WhatsApp Business Platform</SubHeading>
          <P>
            The core function of our Service is to relay API requests to Meta&apos;s WhatsApp Business Platform.
            When you send or receive WhatsApp messages, your message content and recipient phone numbers are
            transmitted to Meta&apos;s servers. Meta&apos;s use of this data is governed by{' '}
            <a href="https://www.whatsapp.com/legal/business-terms" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
              WhatsApp Business Terms of Service
            </a>{' '}
            and{' '}
            <a href="https://www.facebook.com/privacy/policy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
              Meta&apos;s Privacy Policy
            </a>.
          </P>

          <SubHeading>6.2 Google (OAuth 2.0)</SubHeading>
          <P>
            If you use Google Sign-In, your authentication is handled by Google. Google&apos;s use of data is
            governed by{' '}
            <a href="https://policies.google.com/privacy" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
              Google&apos;s Privacy Policy
            </a>.
          </P>

          <SubHeading>6.3 Email Delivery</SubHeading>
          <P>
            Transactional emails (password reset, account approval) are sent via an SMTP provider.
            Only your email address and the content of the notification are shared with the email provider
            for delivery purposes.
          </P>

          {/* 7 */}
          <SectionHeading id="data-sharing" title="7. Data Sharing & Disclosure" />
          <P>We do not sell, trade, or rent your personal information. We may share information only in these circumstances:</P>
          <Ul items={[
            'With your explicit consent',
            'To comply with a legal obligation, court order, or enforceable government request',
            'To protect the rights, property, or safety of Enfinito, our users, or the public',
            'In connection with a merger, acquisition, or sale of assets — you will be notified via email before your data is transferred or becomes subject to a different privacy policy',
          ]} />

          {/* 8 */}
          <SectionHeading id="your-rights" title="8. Your Rights" />
          <P>Depending on your jurisdiction, you may have the following rights regarding your personal data:</P>
          <Ul items={[
            'Access — request a copy of the personal data we hold about you',
            'Correction — request correction of inaccurate or incomplete data',
            'Deletion — request deletion of your account and associated data',
            'Data Portability — request your data in a structured, machine-readable format',
            'Objection — object to processing of your data in certain circumstances',
            'Withdraw Consent — if processing is based on consent, you may withdraw at any time',
          ]} />
          <P>
            To exercise any of these rights, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>.
            We will respond within 30 days.
          </P>
          <P>
            You can delete your Enfinito account at any time from your account settings. Upon deletion, your
            profile data, WhatsApp credentials, and API keys are permanently removed. Message logs associated
            with your instances are also deleted.
          </P>

          {/* 9 */}
          <SectionHeading id="retention" title="9. Data Retention" />
          <P>We retain your personal data for as long as your account is active or as needed to provide the Service.</P>
          <Ul items={[
            'Account data: retained while your account is active; deleted within 30 days of account deletion request',
            'Message logs: retained for 90 days by default; deleted on account deletion',
            'Password reset tokens: single-use; automatically invalidated after 1 hour',
            'Rate-limiting counters: ephemeral; cleared after the rate-limit window expires',
            'Backup data: may be retained for up to 30 additional days in encrypted backups',
          ]} />

          {/* 10 */}
          <SectionHeading id="cookies" title="10. Cookies & Tokens" />
          <P>Enfinito uses the following browser storage mechanisms:</P>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '10px', overflow: 'hidden', marginBottom: '16px',
          }}>
            {[
              { name: 'access_token', type: 'httpOnly Cookie', purpose: 'JWT session token (15 min TTL). Used to authenticate requests.' },
              { name: 'refresh_token', type: 'httpOnly Cookie', purpose: 'JWT refresh token (7 day TTL). Used to renew the access token.' },
              { name: 'oauth_state', type: 'httpOnly Cookie', purpose: 'CSRF protection token during Google OAuth flow (10 min TTL, deleted after use).' },
            ].map(({ name, type, purpose }, i) => (
              <div key={name} style={{
                display: 'grid', gridTemplateColumns: '160px 130px 1fr',
                padding: '12px 16px', gap: '16px', alignItems: 'start',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                fontSize: '13px',
              }}>
                <code style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{name}</code>
                <span style={{ color: 'var(--text-dim)' }}>{type}</span>
                <span style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{purpose}</span>
              </div>
            ))}
          </div>
          <P>
            These are strictly necessary cookies. We do not use tracking cookies, advertising cookies,
            or third-party analytics cookies.
          </P>

          {/* 11 */}
          <SectionHeading id="children" title="11. Children's Privacy" />
          <P>
            The Service is not directed to individuals under the age of 16 (&ldquo;children&rdquo;). We do not knowingly
            collect personal information from children. If you become aware that a child has provided us with
            personal information without parental consent, please contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>.
            We will take steps to remove that information promptly.
          </P>

          {/* 12 */}
          <SectionHeading id="changes" title="12. Changes to This Policy" />
          <P>
            We may update this Privacy Policy from time to time. When we make material changes, we will
            notify you by updating the &ldquo;Last Updated&rdquo; date at the top of this page and, where appropriate,
            by sending an email to the address associated with your account.
          </P>
          <P>
            Your continued use of the Service after any changes constitutes acceptance of the new policy.
            We encourage you to review this page periodically.
          </P>

          {/* 13 */}
          <SectionHeading id="contact" title="13. Contact Us" />
          <P>If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:</P>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '24px', marginTop: '8px',
            display: 'flex', gap: '24px', flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Email</div>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: '14px' }}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Response Time</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Within 30 days</div>
            </div>
          </div>

          {/* Also see */}
          <div style={{
            marginTop: '48px', padding: '24px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '16px',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Also read our Terms of Service</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Rules and guidelines for using the Enfinito platform.</div>
            </div>
            <Link href="/terms" style={{
              padding: '10px 20px', borderRadius: '8px',
              background: 'var(--accent)', color: '#000',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Read Terms →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

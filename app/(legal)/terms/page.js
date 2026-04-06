import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Enfinito',
  description: 'Terms and conditions for using the Enfinito WhatsApp Business API Gateway.',
}

const LAST_UPDATED = 'April 6, 2026'
const EFFECTIVE_DATE = 'April 6, 2026'
const CONTACT_EMAIL = 'legal@enfinito.cloud'

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'description', title: '2. Service Description' },
  { id: 'accounts', title: '3. Accounts & Registration' },
  { id: 'acceptable-use', title: '4. Acceptable Use' },
  { id: 'prohibited', title: '5. Prohibited Uses' },
  { id: 'api', title: '6. API Usage & Rate Limits' },
  { id: 'whatsapp', title: '7. WhatsApp Platform Compliance' },
  { id: 'intellectual-property', title: '8. Intellectual Property' },
  { id: 'privacy', title: '9. Privacy' },
  { id: 'disclaimers', title: '10. Disclaimers' },
  { id: 'liability', title: '11. Limitation of Liability' },
  { id: 'indemnification', title: '12. Indemnification' },
  { id: 'termination', title: '13. Termination' },
  { id: 'changes', title: '14. Changes to Terms' },
  { id: 'governing-law', title: '15. Governing Law' },
  { id: 'contact', title: '16. Contact' },
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

function Warning({ children }) {
  return (
    <div style={{
      background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
      borderLeft: '3px solid var(--red)',
      borderRadius: '0 8px 8px 0', padding: '14px 18px',
      fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7,
      marginBottom: '20px',
    }}>
      {children}
    </div>
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

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '620px', marginBottom: '24px' }}>
          Please read these terms carefully before using the Enfinito platform. By using the Service,
          you agree to be bound by these terms.
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
        {/* Table of Contents */}
        <aside style={{
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
            <strong style={{ color: 'var(--text)' }}>Key Points:</strong> You must be 16+ to use Enfinito.
            You are responsible for your WhatsApp Business credentials and API key usage. You must comply with
            WhatsApp Business Platform policies. Misuse may result in immediate account termination.
          </Highlight>

          {/* 1 */}
          <SectionHeading id="acceptance" title="1. Acceptance of Terms" />
          <P>
            These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
            (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and Enfinito (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            governing your access to and use of the Enfinito WhatsApp Business API Gateway and related services
            (collectively, the &ldquo;Service&rdquo;).
          </P>
          <P>
            By registering for an account, accessing, or using the Service, you affirm that you are at least
            16 years of age, have read and understood these Terms, and agree to be bound by them.
            If you are using the Service on behalf of an organization, you represent that you have the authority
            to bind that organization to these Terms.
          </P>

          {/* 2 */}
          <SectionHeading id="description" title="2. Service Description" />
          <P>
            Enfinito is a WhatsApp Business API gateway platform that enables businesses and developers to:
          </P>
          <Ul items={[
            'Connect WhatsApp Business accounts via the Meta Business Platform API',
            'Send and receive WhatsApp messages programmatically through a REST API',
            'Manage multiple WhatsApp instances and API keys',
            'Receive incoming message webhooks in real time',
            'Monitor message delivery status and logs',
          ]} />
          <P>
            Access to the Service requires an approved account. New registrations are subject to administrator
            review and approval before access is granted.
          </P>

          {/* 3 */}
          <SectionHeading id="accounts" title="3. Accounts & Registration" />

          <SubHeading>3.1 Account Creation</SubHeading>
          <P>
            You may register using an email address and password, or via Google Sign-In (OAuth 2.0).
            You must provide accurate, complete, and current information. You are responsible for maintaining
            the confidentiality of your credentials and for all activity that occurs under your account.
          </P>

          <SubHeading>3.2 Account Approval</SubHeading>
          <P>
            All new accounts (except the first registered administrator) are subject to approval by a platform
            administrator. We reserve the right to approve or deny any registration at our sole discretion
            without providing a reason.
          </P>

          <SubHeading>3.3 Account Security</SubHeading>
          <Ul items={[
            'Notify us immediately at ' + CONTACT_EMAIL + ' if you become aware of any unauthorized use of your account.',
            'Do not share your API keys or session credentials with unauthorized parties.',
            'Use a strong, unique password for your Enfinito account.',
            'We are not liable for any loss resulting from unauthorized access caused by your failure to protect your credentials.',
          ]} />

          <SubHeading>3.4 One Account Per User</SubHeading>
          <P>
            Each individual or organization may maintain only one active Enfinito account unless explicitly
            authorized in writing by us.
          </P>

          {/* 4 */}
          <SectionHeading id="acceptable-use" title="4. Acceptable Use" />
          <P>You agree to use the Service only for lawful purposes and in compliance with these Terms. You may:</P>
          <Ul items={[
            'Send legitimate business communications via WhatsApp',
            'Integrate Enfinito into your own products and services',
            'Create and manage API keys for authorized applications',
            'Process and store incoming webhook data for your business purposes',
          ]} />

          {/* 5 */}
          <SectionHeading id="prohibited" title="5. Prohibited Uses" />
          <Warning>
            Violation of any prohibited use may result in immediate account termination without refund
            and may be reported to applicable authorities or Meta/WhatsApp.
          </Warning>
          <P>You must NOT use the Service to:</P>
          <Ul items={[
            'Send unsolicited messages (spam), bulk promotional messages without opt-in, or messages that violate recipients\' consent',
            'Transmit illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable content',
            'Violate any applicable laws or regulations, including data protection laws',
            'Impersonate any person, business, or entity',
            'Interfere with or disrupt the Service, servers, or networks connected to the Service',
            'Attempt to circumvent rate limits, security measures, or access controls',
            'Use the Service to facilitate phishing, fraud, or social engineering attacks',
            'Transmit malware, viruses, or any destructive code',
            'Harvest or collect personal information about other users or third parties',
            'Use the Service for purposes that violate WhatsApp\'s Business Terms of Service or Messaging Policy',
          ]} />

          {/* 6 */}
          <SectionHeading id="api" title="6. API Usage & Rate Limits" />

          <SubHeading>6.1 API Keys</SubHeading>
          <P>
            API keys are credentials that grant access to the Enfinito API. You are solely responsible for:
          </P>
          <Ul items={[
            'Keeping your API keys confidential and not exposing them in client-side code or public repositories',
            'All API calls made using your keys, whether made by you or by third parties',
            'Revoking keys that may have been compromised and issuing new ones',
          ]} />

          <SubHeading>6.2 Rate Limits</SubHeading>
          <P>
            To ensure fair usage and service stability, the following rate limits apply by default:
          </P>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '10px', overflow: 'hidden', marginBottom: '16px',
          }}>
            {[
              { scope: 'API Key (outbound messages)', limit: '100 requests / minute' },
              { scope: 'Login / Registration', limit: '10 attempts / minute per IP' },
              { scope: 'Password Reset', limit: '10 attempts / minute per IP' },
            ].map(({ scope, limit }, i, arr) => (
              <div key={scope} style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                padding: '12px 16px', gap: '16px', alignItems: 'center',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: '13px',
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{scope}</span>
                <code style={{ color: 'var(--accent)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{limit}</code>
              </div>
            ))}
          </div>
          <P>
            Exceeding rate limits results in a temporary block (&ldquo;429 Too Many Requests&rdquo;).
            Persistent abuse of rate limits may result in account suspension.
          </P>

          <SubHeading>6.3 Fair Use</SubHeading>
          <P>
            Each account plan has an instance limit (free: 3 instances; pro: 20 instances by default).
            Administrators may adjust these limits per account. Attempting to circumvent these limits is
            a violation of these Terms.
          </P>

          {/* 7 */}
          <SectionHeading id="whatsapp" title="7. WhatsApp Platform Compliance" />
          <Highlight>
            Enfinito is a technical gateway to Meta&apos;s WhatsApp Business Platform. You are responsible for
            independently obtaining and maintaining your own WhatsApp Business Platform access from Meta,
            and for complying with all Meta and WhatsApp policies.
          </Highlight>
          <P>You acknowledge and agree that:</P>
          <Ul items={[
            'You must comply with the WhatsApp Business Platform Terms of Service, Messaging Policy, and Commerce Policy',
            'You must have valid user opt-in consent before initiating WhatsApp conversations',
            'You are solely responsible for the content of messages sent through the Service',
            'Enfinito is not responsible for messages blocked, filtered, or penalized by WhatsApp/Meta',
            'Meta may suspend or terminate your WhatsApp Business account independently of Enfinito',
            'You must not use template messages without obtaining prior approval from Meta',
          ]} />

          {/* 8 */}
          <SectionHeading id="intellectual-property" title="8. Intellectual Property" />
          <P>
            The Service, including its software, interface, design, branding, and documentation,
            is owned by Enfinito and protected by intellectual property laws.
          </P>
          <P>
            You retain all rights to content you create, send, or receive through the Service.
            By using the Service, you grant Enfinito a limited, non-exclusive license to process
            your data solely to the extent necessary to provide the Service.
          </P>
          <P>
            You may not copy, modify, distribute, sell, or lease any part of the Service, nor
            reverse-engineer or extract source code, except where expressly permitted by law.
          </P>

          {/* 9 */}
          <SectionHeading id="privacy" title="9. Privacy" />
          <P>
            Your use of the Service is also governed by our{' '}
            <Link href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>,
            which is incorporated into these Terms by reference. By using the Service, you consent to
            the collection and use of your information as described therein.
          </P>

          {/* 10 */}
          <SectionHeading id="disclaimers" title="10. Disclaimers" />
          <P>
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
            WHETHER EXPRESS, IMPLIED, OR STATUTORY. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
            ENFINITO EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
          </P>
          <Ul items={[
            'Implied warranties of merchantability, fitness for a particular purpose, and non-infringement',
            'Uninterrupted, error-free, or secure operation of the Service',
            'Accuracy, completeness, or reliability of any content transmitted through the Service',
            'Availability or functionality of third-party services (Meta/WhatsApp, Google, SMTP providers)',
          ]} />

          {/* 11 */}
          <SectionHeading id="liability" title="11. Limitation of Liability" />
          <P>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ENFINITO AND ITS AFFILIATES, OFFICERS, EMPLOYEES,
            AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
            OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING BUT
            NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </P>
          <P>
            IN NO EVENT SHALL ENFINITO&apos;S TOTAL LIABILITY EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID
            FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) $50 USD.
          </P>

          {/* 12 */}
          <SectionHeading id="indemnification" title="12. Indemnification" />
          <P>
            You agree to defend, indemnify, and hold harmless Enfinito and its affiliates from and against
            any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees)
            arising from:
          </P>
          <Ul items={[
            'Your use of the Service or violation of these Terms',
            'Your breach of any applicable laws or third-party rights',
            'Content transmitted through your account',
            'Your violation of WhatsApp\'s or Meta\'s policies',
          ]} />

          {/* 13 */}
          <SectionHeading id="termination" title="13. Termination" />

          <SubHeading>13.1 Termination by You</SubHeading>
          <P>
            You may terminate your account at any time by contacting us or using the account deletion feature.
            Termination does not entitle you to any refund for prepaid fees.
          </P>

          <SubHeading>13.2 Termination by Enfinito</SubHeading>
          <P>
            We reserve the right to suspend or terminate your account and access to the Service at any time,
            with or without notice, for reasons including but not limited to:
          </P>
          <Ul items={[
            'Violation of these Terms or our Acceptable Use Policy',
            'Fraudulent, abusive, or illegal activity',
            'Non-payment (for paid plans)',
            'Extended inactivity',
            'Compliance with a legal requirement or court order',
          ]} />

          <SubHeading>13.3 Effect of Termination</SubHeading>
          <P>
            Upon termination, your right to use the Service immediately ceases. Sections relating to
            intellectual property, disclaimers, limitation of liability, indemnification, and governing law
            survive termination.
          </P>

          {/* 14 */}
          <SectionHeading id="changes" title="14. Changes to Terms" />
          <P>
            We may revise these Terms at any time. When we make material changes, we will update the
            &ldquo;Last Updated&rdquo; date and notify you via email or a notice within the Service.
            Your continued use of the Service after the effective date of revised Terms constitutes
            your acceptance of the changes.
          </P>

          {/* 15 */}
          <SectionHeading id="governing-law" title="15. Governing Law" />
          <P>
            These Terms are governed by and construed in accordance with applicable law.
            Any dispute arising from these Terms or your use of the Service shall be resolved through
            good-faith negotiation. If negotiation fails, disputes shall be submitted to binding arbitration
            or the courts of competent jurisdiction.
          </P>

          {/* 16 */}
          <SectionHeading id="contact" title="16. Contact" />
          <P>For questions about these Terms or to report a violation, contact us:</P>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '24px', marginTop: '8px',
            display: 'flex', gap: '24px', flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Legal Email</div>
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
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Also read our Privacy Policy</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>How we collect, use, and protect your personal data.</div>
            </div>
            <Link href="/privacy" style={{
              padding: '10px 20px', borderRadius: '8px',
              background: 'var(--accent)', color: '#000',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Read Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

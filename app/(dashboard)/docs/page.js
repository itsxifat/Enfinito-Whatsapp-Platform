export default function DocsPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'

  // ── Reusable components ────────────────────────────────────────────────────

  const Section = ({ id, title, children }) => (
    <div id={id} style={{ marginBottom: '48px', scrollMarginTop: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
        {title}
      </h2>
      {children}
    </div>
  )

  const SubSection = ({ title, children }) => (
    <div style={{ marginBottom: '28px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '11px' }}>{title}</h3>
      {children}
    </div>
  )

  const Code = ({ children }) => (
    <pre style={{ background: '#080808', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 20px', fontSize: '12px', lineHeight: 1.8, overflow: 'auto', color: '#d4d4d4', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", margin: '10px 0' }}>
      {children}
    </pre>
  )

  const Method = ({ type }) => {
    const colors = { POST: ['rgba(37,211,102,0.15)', 'var(--accent)', 'rgba(37,211,102,0.3)'], GET: ['rgba(96,165,250,0.15)', '#60a5fa', 'rgba(96,165,250,0.3)'] }
    const [bg, color, border] = colors[type] || colors.POST
    return (
      <span style={{ background: bg, color, border: `1px solid ${border}`, padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', flexShrink: 0 }}>
        {type}
      </span>
    )
  }

  const Endpoint = ({ method, path, desc }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px', marginBottom: '8px' }}>
      <Method type={method} />
      <code style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text)', flex: 1 }}>{path}</code>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>{desc}</span>
    </div>
  )

  const Note = ({ type = 'info', children }) => {
    const styles = {
      info:    { bg: 'rgba(96,165,250,0.06)',  border: 'rgba(96,165,250,0.2)',  color: '#93c5fd', icon: 'ℹ️' },
      tip:     { bg: 'rgba(37,211,102,0.06)',  border: 'rgba(37,211,102,0.2)',  color: '#4ade80', icon: '💡' },
      warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24', icon: '⚠️' },
    }
    const s = styles[type]
    return (
      <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '9px', padding: '12px 16px', margin: '12px 0', fontSize: '13px', color: s.color, lineHeight: 1.65, display: 'flex', gap: '10px' }}>
        <span style={{ flexShrink: 0 }}>{s.icon}</span>
        <span>{children}</span>
      </div>
    )
  }

  const Param = ({ name, type, required, children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 80px 60px 1fr', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px', alignItems: 'start' }}>
      <code style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: '12px' }}>{name}</code>
      <span style={{ color: '#93c5fd', fontSize: '12px' }}>{type}</span>
      <span style={{ fontSize: '11px', fontWeight: 600, color: required ? 'var(--red)' : 'var(--text-dim)' }}>{required ? 'required' : 'optional'}</span>
      <span style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{children}</span>
    </div>
  )

  const toc = [
    { id: 'quickstart',   label: 'Quick Start' },
    { id: 'auth',         label: 'Authentication' },
    { id: 'endpoints',    label: 'Endpoints' },
    { id: 'text',         label: 'Text Messages' },
    { id: 'templates',    label: 'Template Messages' },
    { id: 'media',        label: 'Media Messages' },
    { id: 'webhook',      label: 'Webhooks' },
    { id: 'errors',       label: 'Error Codes' },
    { id: 'examples',     label: 'Code Examples' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '40px', maxWidth: '1000px', alignItems: 'start' }}>

      {/* Main content */}
      <div>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>API Reference</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
            Complete documentation for integrating WhatsApp messaging into your apps via the Enfinito API.
          </p>
        </div>

        {/* Quick start */}
        <Section id="quickstart" title="Quick Start">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[
              { step: '1', title: 'Get API key', desc: 'Generate a key from the API Keys page and link it to an instance' },
              { step: '2', title: 'Send a message', desc: 'POST to /api/v1/send with your key in the X-API-Key header' },
              { step: '3', title: 'Use templates', desc: 'Sync approved Meta templates to message any user first' },
            ].map(s => (
              <div key={s.step} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--accent)', marginBottom: '10px' }}>{s.step}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <Code>{`curl -X POST ${base}/api/v1/send \\
  -H "X-API-Key: enf_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"to":"+1234567890","type":"text","text":{"body":"Hello! 👋"}}'`}</Code>
        </Section>

        {/* Auth */}
        <Section id="auth" title="Authentication">
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
            Every request must include your API key in the <code style={{ fontFamily: 'monospace', background: '#111', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>X-API-Key</code> header.
            Each key is tied to one WhatsApp instance (phone number).
          </p>
          <Code>{`X-API-Key: enf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</Code>
          <Note type="warning">
            Never expose your API key in frontend JavaScript or public repositories. Use environment variables on your server.
          </Note>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '8px' }}>
            Generate keys on the <a href="/api-keys" style={{ color: 'var(--accent)' }}>API Keys</a> page. Rate limit: <strong style={{ color: 'var(--text)' }}>100 requests / minute</strong> per key.
          </p>
        </Section>

        {/* Endpoints */}
        <Section id="endpoints" title="Endpoints">
          <SubSection title="Base URL">
            <Code>{`${base}/api/v1`}</Code>
          </SubSection>
          <SubSection title="Available endpoints">
            <Endpoint method="POST" path="/api/v1/send" desc="Send any type of message" />
          </SubSection>
          <SubSection title="Request body parameters">
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px 16px' }}>
              <Param name="to" type="string" required>Recipient phone number with country code. E.g. <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>+8801234567890</code></Param>
              <Param name="type" type="string" required><code style={{ fontFamily: 'monospace', fontSize: '11px' }}>text</code> · <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>template</code> · <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>image</code> · <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>document</code> · <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>audio</code> · <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>video</code></Param>
              <Param name="text" type="object" required={false}>Required when type is <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>text</code>. Contains <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>body</code> (string)</Param>
              <Param name="template" type="object" required={false}>Required when type is <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>template</code>. Contains <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>name</code>, <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>language</code>, and optional <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>components</code></Param>
              <Param name="image / document / audio / video" type="object" required={false}>Required for respective media types. Contains <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>link</code> (URL) and optional <code style={{ fontFamily: 'monospace', fontSize: '11px' }}>caption</code></Param>
            </div>
          </SubSection>
        </Section>

        {/* Text */}
        <Section id="text" title="Text Messages">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.7 }}>
            Use text messages to reply within the <strong style={{ color: 'var(--text)' }}>24-hour conversation window</strong> — i.e. after a user has messaged you first.
          </p>
          <Code>{`POST ${base}/api/v1/send

{
  "to": "+8801234567890",
  "type": "text",
  "text": {
    "body": "Hello! How can I help you today? 😊",
    "preview_url": false
  }
}`}</Code>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '12px 0 6px' }}>Successful response:</p>
          <Code>{`{
  "success": true,
  "messageId": "wamid.HBgLMTIzNDU2Nzg5ABIAERgSNjY2...",
  "status": "sent"
}`}</Code>
          <Note type="tip">
            Set <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>"preview_url": true</code> to generate a link preview when your message contains a URL.
          </Note>
        </Section>

        {/* Templates */}
        <Section id="templates" title="Template Messages">
          <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px', color: '#c084fc', lineHeight: 1.7 }}>
            <strong>Why templates?</strong> WhatsApp only allows free-form messages within a 24-hour window after the user messages you first.
            To send the <strong>first message</strong> to any user (or after 24h of inactivity), you must use a <strong>pre-approved template</strong>.
            Templates are created in Meta Business Manager and approved by Meta — usually within 24–48 hours.
          </div>

          <SubSection title="How templates work">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                ['Create', 'Go to Meta Business Manager → WhatsApp Manager → Message Templates'],
                ['Design', 'Write your message using {{1}}, {{2}} as variable placeholders'],
                ['Submit', 'Choose a category (Marketing, Utility, or Authentication) and submit for review'],
                ['Approve', 'Meta reviews and approves within 24–48 hours'],
                ['Sync', 'Go to Instance → Message Templates → Sync from Meta to import approved templates'],
                ['Send', 'Use the template name + fill in variables when calling the API'],
              ].map(([title, desc], i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#c084fc', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--text)' }}>{title}:</strong>{' '}
                    <span style={{ color: 'var(--text-muted)' }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection title="Template with no variables (e.g. hello_world)">
            <Code>{`POST ${base}/api/v1/send

{
  "to": "+8801234567890",
  "type": "template",
  "template": {
    "name": "hello_world",
    "language": { "code": "en_US" },
    "components": []
  }
}`}</Code>
          </SubSection>

          <SubSection title="Template with body variables">
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.7 }}>
              If your template body is: <em style={{ color: 'var(--text)' }}>"Hello {'{{1}}'}, your order {'{{2}}'} is confirmed!"</em><br />
              You pass the values as <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>parameters</code> in the body component:
            </p>
            <Code>{`POST ${base}/api/v1/send

{
  "to": "+8801234567890",
  "type": "template",
  "template": {
    "name": "order_confirmed",
    "language": { "code": "en_US" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "John" },
          { "type": "text", "text": "ORD-98765" }
        ]
      }
    ]
  }
}`}</Code>
            <Note type="tip">
              The order of <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>parameters</code> maps directly to {'{{1}}'}, {'{{2}}'} etc. in your template body.
            </Note>
          </SubSection>

          <SubSection title="Template with header + body variables">
            <Code>{`{
  "to": "+8801234567890",
  "type": "template",
  "template": {
    "name": "shipping_update",
    "language": { "code": "en_US" },
    "components": [
      {
        "type": "header",
        "parameters": [
          { "type": "text", "text": "Shipment #12345" }
        ]
      },
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "John" },
          { "type": "text", "text": "Wednesday, 3pm–6pm" }
        ]
      }
    ]
  }
}`}</Code>
          </SubSection>

          <SubSection title="Template with URL button (dynamic suffix)">
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.7 }}>
              If your template has a <strong style={{ color: 'var(--text)' }}>URL button</strong> whose URL ends in <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>{'{{1}}'}</code> (e.g. <em style={{ color: 'var(--text-dim)' }}>https://example.com/order/{'{{1}}'}</em>),
              you must pass the dynamic suffix as a <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>button</code> component:
            </p>
            <Code>{`{
  "to": "+8801234567890",
  "type": "template",
  "template": {
    "name": "order_tracking",
    "language": { "code": "en_US" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "John" }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": "0",
        "parameters": [
          { "type": "text", "text": "ORD-98765" }
        ]
      }
    ]
  }
}`}</Code>
            <Note type="warning">
              This is required when the button URL contains <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>{'{{1}}'}</code>. Omitting it causes error <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>#131008 — Required parameter is missing</code>.
            </Note>
            <Note type="tip">
              <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>index</code> is the 0-based position of the button in the template's BUTTONS component. If the URL button is the second button, use <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>"index": "1"</code>.
            </Note>
          </SubSection>

          <SubSection title="Template with quick reply buttons">
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.7 }}>
              Quick reply buttons can carry a developer-defined <strong style={{ color: 'var(--text)' }}>payload</strong> that is sent back to your webhook when the user taps the button:
            </p>
            <Code>{`{
  "to": "+8801234567890",
  "type": "template",
  "template": {
    "name": "support_followup",
    "language": { "code": "en_US" },
    "components": [
      {
        "type": "button",
        "sub_type": "quick_reply",
        "index": "0",
        "parameters": [
          { "type": "payload", "payload": "YES_RESOLVED" }
        ]
      },
      {
        "type": "button",
        "sub_type": "quick_reply",
        "index": "1",
        "parameters": [
          { "type": "payload", "payload": "NO_STILL_OPEN" }
        ]
      }
    ]
  }
}`}</Code>
            <Note type="tip">
              The payload value is returned in the webhook under <code style={{ fontFamily: 'monospace', fontSize: '12px' }}>messages[0].button.payload</code>. Use it to route the user's response in your system.
            </Note>
          </SubSection>

          <SubSection title="Button types reference">
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              {[
                ['URL', 'url', 'Opens a URL. If URL ends in {{1}}, pass the suffix as { "type": "text", "text": "..." }'],
                ['QUICK_REPLY', 'quick_reply', 'Sends a payload to your webhook when tapped. Pass { "type": "payload", "payload": "..." }'],
                ['PHONE_NUMBER', '(none)', 'Dials a static phone number. No parameters needed.'],
              ].map(([type, subType, desc]) => (
                <div key={type} style={{ display: 'grid', gridTemplateColumns: '140px 120px 1fr', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px', gap: '12px', alignItems: 'start' }}>
                  <code style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>{type}</code>
                  <code style={{ fontFamily: 'monospace', fontSize: '11px', color: '#93c5fd' }}>{subType}</code>
                  <span style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</span>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection title="Template categories">
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              {[
                ['MARKETING',      '#c084fc', 'Promotions, offers, product announcements. Costs more but reaches cold users.'],
                ['UTILITY',        '#93c5fd', 'Order confirmations, shipping updates, account alerts. Lower cost.'],
                ['AUTHENTICATION', '#fb923c', 'OTP / verification codes. Cheapest and fastest approval.'],
              ].map(([cat, color, desc]) => (
                <div key={cat} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px', gap: '16px' }}>
                  <code style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color }}>{cat}</code>
                  <span style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</span>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection title="Template statuses">
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              {[
                ['APPROVED', 'var(--accent)', 'Ready to use. Can be sent to any user.'],
                ['PENDING',  'var(--yellow)', 'Under review by Meta. Usually resolved within 24–48h.'],
                ['REJECTED', 'var(--red)',    'Denied by Meta. Edit and resubmit or create a new template.'],
                ['PAUSED',   '#9ca3af',       'Temporarily disabled by Meta due to poor engagement.'],
              ].map(([s, color, desc]) => (
                <div key={s} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', padding: '11px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px', gap: '16px' }}>
                  <code style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color }}>{s}</code>
                  <span style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</span>
                </div>
              ))}
            </div>
          </SubSection>
        </Section>

        {/* Media */}
        <Section id="media" title="Media Messages">
          <Note type="info">
            Media messages also require the user to have messaged you first within 24 hours — unless sent inside a template with a media header.
          </Note>
          <SubSection title="Image">
            <Code>{`{
  "to": "+8801234567890",
  "type": "image",
  "image": {
    "link": "https://example.com/banner.jpg",
    "caption": "Our new collection is here! 🛍️"
  }
}`}</Code>
          </SubSection>
          <SubSection title="Document / PDF">
            <Code>{`{
  "to": "+8801234567890",
  "type": "document",
  "document": {
    "link": "https://example.com/invoice-123.pdf",
    "filename": "Invoice-123.pdf",
    "caption": "Your invoice for order #123"
  }
}`}</Code>
          </SubSection>
          <SubSection title="Audio">
            <Code>{`{
  "to": "+8801234567890",
  "type": "audio",
  "audio": {
    "link": "https://example.com/audio.mp3"
  }
}`}</Code>
          </SubSection>
          <SubSection title="Video">
            <Code>{`{
  "to": "+8801234567890",
  "type": "video",
  "video": {
    "link": "https://example.com/promo.mp4",
    "caption": "Watch our latest product demo"
  }
}`}</Code>
          </SubSection>
        </Section>

        {/* Webhook */}
        <Section id="webhook" title="Webhooks (Receiving Messages)">
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '14px' }}>
            When someone sends a message to your WhatsApp number, Meta forwards it to your webhook URL.
            This is configured per-instance in Meta for Developers.
          </p>
          <Code>{`Webhook URL:   ${base}/api/v1/webhook/{instanceId}
Verify Token:  (shown on your Instance page)`}</Code>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '14px 0 10px', lineHeight: 1.7 }}>
            Inbound messages are automatically saved to your message log. Delivery and read status updates are also processed automatically.
          </p>
          <Note type="tip">
            Set up the webhook in <strong>Meta for Developers → Your App → WhatsApp → Configuration</strong> and subscribe to the <strong>messages</strong> field.
          </Note>
        </Section>

        {/* Errors */}
        <Section id="errors" title="Error Codes">
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
            {[
              ['401', 'Unauthorized',    'Missing or invalid API key'],
              ['400', 'Bad Request',     'Validation error — check the details field in the response'],
              ['404', 'Not Found',       'Instance not found or inactive'],
              ['429', 'Rate Limited',    '100 requests / minute per key — wait and retry'],
              ['502', 'Bad Gateway',     'Could not reach WhatsApp API — retry in a few seconds'],
            ].map(([code, name, desc]) => (
              <div key={code} style={{ display: 'grid', gridTemplateColumns: '55px 150px 1fr', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px', gap: '12px' }}>
                <code style={{ color: 'var(--red)', fontFamily: 'monospace', fontWeight: 700 }}>{code}</code>
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>{name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{desc}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Meta API errors are passed through with their original code and message. Use the <strong style={{ color: 'var(--text)' }}>fbtrace_id</strong> field in the error response when contacting Meta support.
          </p>
        </Section>

        {/* Code examples */}
        <Section id="examples" title="Code Examples">
          <SubSection title="JavaScript — send text message">
            <Code>{`const res = await fetch('${base}/api/v1/send', {
  method: 'POST',
  headers: {
    'X-API-Key': 'enf_live_YOUR_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+8801234567890',
    type: 'text',
    text: { body: 'Hello from my app! 👋' },
  }),
})
const data = await res.json()
console.log(data.messageId) // wamid.xxx...`}</Code>
          </SubSection>

          <SubSection title="JavaScript — send template with variables">
            <Code>{`const res = await fetch('${base}/api/v1/send', {
  method: 'POST',
  headers: {
    'X-API-Key': 'enf_live_YOUR_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+8801234567890',
    type: 'template',
    template: {
      name: 'order_confirmed',          // your approved template name
      language: { code: 'en_US' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: 'Sarah' },       // fills {{1}}
            { type: 'text', text: 'ORD-44521' },   // fills {{2}}
          ],
        },
      ],
    },
  }),
})
const data = await res.json()
if (data.success) {
  console.log('Sent! Message ID:', data.messageId)
} else {
  console.error('Failed:', data.error, data.code)
}`}</Code>
          </SubSection>

          <SubSection title="Python — send template">
            <Code>{`import requests

response = requests.post(
    '${base}/api/v1/send',
    headers={
        'X-API-Key': 'enf_live_YOUR_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'to': '+8801234567890',
        'type': 'template',
        'template': {
            'name': 'order_confirmed',
            'language': {'code': 'en_US'},
            'components': [
                {
                    'type': 'body',
                    'parameters': [
                        {'type': 'text', 'text': 'Sarah'},
                        {'type': 'text', 'text': 'ORD-44521'},
                    ],
                }
            ],
        },
    }
)
data = response.json()
print(data)`}</Code>
          </SubSection>

          <SubSection title="PHP — send text message">
            <Code>{`$response = file_get_contents('${base}/api/v1/send', false,
  stream_context_create([
    'http' => [
      'method'  => 'POST',
      'header'  => "X-API-Key: enf_live_YOUR_KEY\\r\\nContent-Type: application/json",
      'content' => json_encode([
        'to'   => '+8801234567890',
        'type' => 'text',
        'text' => ['body' => 'Hello from PHP!'],
      ]),
    ],
  ])
);
$data = json_decode($response, true);
echo $data['messageId'];`}</Code>
          </SubSection>

          <SubSection title="Node.js with axios — bulk template send">
            <Code>{`const axios = require('axios')

const contacts = [
  { phone: '+8801234567890', name: 'Sarah', order: 'ORD-001' },
  { phone: '+8809876543210', name: 'Karim', order: 'ORD-002' },
]

async function sendBulk() {
  for (const contact of contacts) {
    try {
      const { data } = await axios.post(
        '${base}/api/v1/send',
        {
          to: contact.phone,
          type: 'template',
          template: {
            name: 'order_confirmed',
            language: { code: 'en_US' },
            components: [{
              type: 'body',
              parameters: [
                { type: 'text', text: contact.name },
                { type: 'text', text: contact.order },
              ],
            }],
          },
        },
        { headers: { 'X-API-Key': 'enf_live_YOUR_KEY' } }
      )
      console.log(\`✓ \${contact.phone} — \${data.messageId}\`)
    } catch (err) {
      console.error(\`✗ \${contact.phone} — \${err.response?.data?.error}\`)
    }
    // Respect rate limit: 100 req/min
    await new Promise(r => setTimeout(r, 700))
  }
}

sendBulk()`}</Code>
          </SubSection>
        </Section>
      </div>

      {/* Sticky TOC */}
      <div style={{ position: 'sticky', top: '24px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>On this page</div>
          {toc.map(item => (
            <a key={item.id} href={`#${item.id}`} style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', padding: '5px 0', lineHeight: 1.4, transition: 'color 0.12s' }}
              onMouseEnter={undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}

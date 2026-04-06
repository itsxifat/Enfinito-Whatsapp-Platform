export default function DocsPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        {title}
      </h2>
      {children}
    </div>
  )

  const Code = ({ children, lang = 'json' }) => (
    <pre style={{
      background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: '10px',
      padding: '16px 20px', fontSize: '12px', lineHeight: 1.7, overflow: 'auto',
      color: '#ccc', fontFamily: 'monospace', margin: '12px 0',
    }}>{children}</pre>
  )

  const Endpoint = ({ method, path, desc }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '12px 16px', marginBottom: '10px',
    }}>
      <span style={{
        background: method === 'POST' ? 'rgba(37,211,102,0.15)' : 'rgba(96,165,250,0.15)',
        color: method === 'POST' ? 'var(--accent)' : '#60a5fa',
        border: `1px solid ${method === 'POST' ? 'rgba(37,211,102,0.3)' : 'rgba(96,165,250,0.3)'}`,
        padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
        flexShrink: 0,
      }}>{method}</span>
      <code style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text)', flex: 1 }}>{path}</code>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</span>
    </div>
  )

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>API Reference</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Integrate WhatsApp messaging into your apps using your API key
        </p>
      </div>

      <Section title="Authentication">
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
          All API requests require an API key passed in the <code style={{ fontFamily: 'monospace', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>X-API-Key</code> header.
        </p>
        <Code>{`X-API-Key: enf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</Code>
        <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
          Generate API keys from the <a href="/api-keys" style={{ color: 'var(--accent)' }}>API Keys</a> page. Never expose keys in frontend code.
        </p>
      </Section>

      <Section title="Base URL">
        <Code>{`${base}/api/v1`}</Code>
      </Section>

      <Section title="Endpoints">
        <Endpoint method="POST" path="/api/v1/send" desc="Send a WhatsApp message" />
      </Section>

      <Section title="Send Text Message">
        <Code>{`POST /api/v1/send

{
  "to": "+1234567890",
  "type": "text",
  "text": {
    "body": "Hello! 👋",
    "preview_url": false
  }
}`}</Code>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Response:</p>
        <Code>{`{
  "success": true,
  "messageId": "wamid.HBgLMTIzNDU2Nzg5ABIAERgSNjY2...",
  "status": "sent"
}`}</Code>
      </Section>

      <Section title="Send Template Message">
        <Code>{`POST /api/v1/send

{
  "to": "+1234567890",
  "type": "template",
  "template": {
    "name": "hello_world",
    "language": { "code": "en_US" },
    "components": []
  }
}`}</Code>
      </Section>

      <Section title="Send Media (Image / Document)">
        <Code>{`// Image
{
  "to": "+1234567890",
  "type": "image",
  "image": {
    "link": "https://example.com/image.jpg",
    "caption": "Check this out!"
  }
}

// Document
{
  "to": "+1234567890",
  "type": "document",
  "document": {
    "link": "https://example.com/file.pdf",
    "filename": "invoice.pdf",
    "caption": "Your invoice"
  }
}`}</Code>
      </Section>

      <Section title="Receiving Messages (Webhook)">
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
          Configure your instance&apos;s webhook URL in Meta for Developers. Inbound messages are logged automatically.
        </p>
        <Code>{`Webhook URL:  ${base}/api/v1/webhook/{instanceId}
Verify Token: (shown on your Instance page)`}</Code>
      </Section>

      <Section title="Error Codes">
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
          {[
            ['401', 'Unauthorized', 'Missing or invalid API key'],
            ['400', 'Bad Request', 'Validation error — check details field'],
            ['429', 'Rate Limited', '100 requests/minute per key'],
            ['502', 'Bad Gateway', 'WhatsApp API unreachable'],
          ].map(([code, name, desc]) => (
            <div key={code} style={{ display: 'grid', gridTemplateColumns: '60px 140px 1fr', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
              <code style={{ color: 'var(--red)', fontFamily: 'monospace', fontWeight: 600 }}>{code}</code>
              <span style={{ color: 'var(--text)' }}>{name}</span>
              <span style={{ color: 'var(--text-muted)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Code Examples">
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>JavaScript (fetch)</p>
        <Code>{`const res = await fetch('${base}/api/v1/send', {
  method: 'POST',
  headers: {
    'X-API-Key': 'enf_live_YOUR_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+1234567890',
    type: 'text',
    text: { body: 'Hello from my app!' }
  })
})
const data = await res.json()
console.log(data.messageId)`}</Code>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Python</p>
        <Code>{`import requests

response = requests.post(
    '${base}/api/v1/send',
    headers={
        'X-API-Key': 'enf_live_YOUR_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'to': '+1234567890',
        'type': 'text',
        'text': {'body': 'Hello from Python!'}
    }
)
print(response.json())`}</Code>
      </Section>
    </div>
  )
}

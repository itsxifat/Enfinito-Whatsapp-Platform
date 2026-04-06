'use client'
import { useState } from 'react'

const MESSAGE_TYPES = [
  { value: 'text',     label: 'Text' },
  { value: 'template', label: 'Template' },
  { value: 'image',    label: 'Image' },
  { value: 'document', label: 'Document' },
]

const EXAMPLES = {
  text: {
    type: 'text',
    text: { body: 'Hello! This is a test message 👋' },
  },
  template: {
    type: 'template',
    template: {
      name: 'hello_world',
      language: { code: 'en_US' },
      components: [],
    },
  },
  image: {
    type: 'image',
    image: { link: 'https://example.com/image.jpg', caption: 'Test image' },
  },
  document: {
    type: 'document',
    document: { link: 'https://example.com/file.pdf', filename: 'test.pdf', caption: 'Test doc' },
  },
}

function buildPayload(type, bodyText) {
  try {
    const parsed = JSON.parse(bodyText)
    return { ok: true, data: parsed }
  } catch {
    return { ok: false, error: 'Invalid JSON in message body' }
  }
}

export default function MessageTester({ instanceId }) {
  const [to, setTo]           = useState('')
  const [type, setType]       = useState('text')
  const [bodyText, setBodyText] = useState(JSON.stringify(EXAMPLES.text, null, 2))
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)  // { success, data }
  const [copied, setCopied]   = useState(false)

  function handleTypeChange(t) {
    setType(t)
    setBodyText(JSON.stringify(EXAMPLES[t], null, 2))
    setResult(null)
  }

  async function handleSend(e) {
    e.preventDefault()
    setResult(null)

    const built = buildPayload(type, bodyText)
    if (!built.ok) {
      setResult({ success: false, data: { error: built.error } })
      return
    }

    setLoading(true)
    try {
      const res  = await fetch(`/api/instances/${instanceId}/test-send`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ to, ...built.data }),
      })
      const data = await res.json()
      setResult({ success: data.success === true, data })
    } catch (err) {
      setResult({ success: false, data: { error: 'Network error', detail: err.message } })
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resultJson = result ? JSON.stringify(result.data, null, 2) : ''

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '24px', marginBottom: '20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
          background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        }}>🧪</div>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Message Tester</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '1px' }}>
            Send a test message directly from this instance and inspect the full API response
          </p>
        </div>
      </div>

      <form onSubmit={handleSend}>
        {/* Recipient + type row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label className="label">Recipient phone number</label>
            <input
              className="input mono"
              placeholder="+1234567890"
              value={to}
              onChange={e => setTo(e.target.value)}
              required
              style={{ fontSize: '13px' }}
            />
          </div>
          <div>
            <label className="label">Message type</label>
            <select
              className="input"
              value={type}
              onChange={e => handleTypeChange(e.target.value)}
              style={{ fontSize: '13px', cursor: 'pointer' }}
            >
              {MESSAGE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Body editor */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="label" style={{ margin: 0 }}>Message payload (JSON)</label>
            <button
              type="button"
              onClick={() => setBodyText(JSON.stringify(EXAMPLES[type], null, 2))}
              style={{
                fontSize: '11px', color: 'var(--text-dim)', background: 'none',
                border: 'none', cursor: 'pointer', padding: '0',
              }}
            >
              Reset to example
            </button>
          </div>
          <textarea
            className="input mono"
            value={bodyText}
            onChange={e => setBodyText(e.target.value)}
            rows={type === 'text' ? 5 : 9}
            spellCheck={false}
            style={{ fontSize: '12px', lineHeight: 1.65, resize: 'vertical', fontFamily: 'monospace' }}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ minWidth: '120px' }}
        >
          {loading ? 'Sending...' : '▶ Send test message'}
        </button>
      </form>

      {/* Result panel */}
      {result && (
        <div style={{ marginTop: '20px' }}>
          {/* Status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                background: result.success
                  ? 'rgba(37,211,102,0.12)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${result.success ? 'rgba(37,211,102,0.25)' : 'rgba(239,68,68,0.25)'}`,
                color: result.success ? 'var(--accent)' : 'var(--red)',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: result.success ? 'var(--accent)' : 'var(--red)',
                  display: 'inline-block',
                }} />
                {result.success ? 'Success' : 'Failed'}
              </span>
              {!result.success && result.data?.code && (
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Error code: <span style={{ fontFamily: 'monospace', color: 'var(--red)' }}>{result.data.code}</span>
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              style={{
                fontSize: '12px', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                background: copied ? 'rgba(37,211,102,0.12)' : 'var(--bg)',
                border: `1px solid ${copied ? 'rgba(37,211,102,0.3)' : 'var(--border)'}`,
                color: copied ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {copied ? '✓ Copied' : '⎘ Copy response'}
            </button>
          </div>

          {/* Error summary (only on failure) */}
          {!result.success && result.data?.error && (
            <div style={{
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '8px',
              fontSize: '13px', color: '#fca5a5', lineHeight: 1.6,
            }}>
              <strong style={{ color: 'var(--red)' }}>Error:</strong> {result.data.error}
              {result.data.fbtrace_id && (
                <span style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                  fbtrace_id: {result.data.fbtrace_id}
                </span>
              )}
            </div>
          )}

          {/* Raw JSON */}
          <pre style={{
            background: '#0a0a0a', border: '1px solid var(--border)', borderRadius: '8px',
            padding: '14px 16px', fontSize: '12px', lineHeight: 1.7, overflow: 'auto',
            color: result.success ? '#86efac' : '#fca5a5',
            fontFamily: 'monospace', margin: 0, maxHeight: '260px',
          }}>
            {resultJson}
          </pre>

          {!result.success && (
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px', lineHeight: 1.6 }}>
              Click <strong style={{ color: 'var(--text-muted)' }}>⎘ Copy response</strong> to copy the full error details and share with support for debugging.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

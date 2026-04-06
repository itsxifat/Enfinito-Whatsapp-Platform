'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MessageTester({ instanceId }) {
  const [to, setTo]           = useState('')
  const [body, setBody]       = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [copied, setCopied]   = useState(false)

  async function handleSend(e) {
    e.preventDefault()
    setResult(null)
    setLoading(true)
    try {
      const res  = await fetch(`/api/instances/${instanceId}/test-send`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ to, type: 'text', text: { body } }),
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
    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', overflow:'hidden', marginBottom:'20px' }}>
      {/* Header */}
      <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(37,211,102,0.12)', border:'1px solid rgba(37,211,102,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px' }}>🧪</div>
          <div>
            <div style={{ fontSize:'14px', fontWeight:600 }}>Quick Text Tester</div>
            <div style={{ fontSize:'11px', color:'var(--text-dim)', marginTop:'1px' }}>Send a test text message and inspect the API response</div>
          </div>
        </div>
        <Link href={`/instances/${instanceId}/templates`} style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'12px', fontWeight:600, color:'#c084fc', background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.25)', borderRadius:'7px', padding:'6px 12px', textDecoration:'none', transition:'all 0.12s' }}>
          📋 Use Templates →
        </Link>
      </div>

      <div style={{ padding:'20px 24px' }}>
        <form onSubmit={handleSend}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
            <div>
              <label className="label">Recipient</label>
              <input className="input mono" placeholder="+8801234567890" value={to} onChange={e => setTo(e.target.value)} required style={{ fontSize:'13px' }} />
            </div>
            <div>
              <label className="label">Message</label>
              <input className="input" placeholder="Hello! 👋" value={body} onChange={e => setBody(e.target.value)} required style={{ fontSize:'13px' }} />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ fontSize:'13px', padding:'9px 20px' }}>
            {loading ? 'Sending...' : '▶ Send'}
          </button>
        </form>

        {result && (
          <div style={{ marginTop:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'12px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', background: result.success ? 'rgba(37,211,102,0.12)' : 'rgba(239,68,68,0.1)', color: result.success ? 'var(--accent)' : 'var(--red)', border:`1px solid ${result.success ? 'rgba(37,211,102,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                {result.success ? '✓ Sent' : '✗ Failed'}
                {!result.success && result.data?.code ? ` — code ${result.data.code}` : ''}
              </span>
              <button onClick={handleCopy} style={{ fontSize:'11px', padding:'4px 10px', borderRadius:'6px', cursor:'pointer', background: copied ? 'rgba(37,211,102,0.1)' : 'var(--bg)', border:`1px solid ${copied ? 'rgba(37,211,102,0.3)' : 'var(--border)'}`, color: copied ? 'var(--accent)' : 'var(--text-dim)', transition:'all 0.15s' }}>
                {copied ? '✓ Copied' : '⎘ Copy response'}
              </button>
            </div>
            {!result.success && result.data?.error && (
              <div style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', padding:'10px 14px', marginBottom:'8px', fontSize:'12px', color:'#fca5a5', lineHeight:1.6 }}>
                {result.data.error}
                {result.data.fbtrace_id && <span style={{ display:'block', marginTop:'4px', fontFamily:'monospace', fontSize:'11px', color:'var(--text-dim)' }}>fbtrace_id: {result.data.fbtrace_id}</span>}
              </div>
            )}
            <pre style={{ background:'#0a0a0a', border:'1px solid var(--border)', borderRadius:'8px', padding:'12px 14px', fontSize:'11px', lineHeight:1.7, overflow:'auto', color: result.success ? '#86efac' : '#fca5a5', fontFamily:'monospace', maxHeight:'180px', margin:0 }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
            {!result.success && (
              <p style={{ fontSize:'11px', color:'var(--text-dim)', marginTop:'6px' }}>
                Click <strong style={{ color:'var(--text-muted)' }}>⎘ Copy response</strong> to share with support for debugging.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

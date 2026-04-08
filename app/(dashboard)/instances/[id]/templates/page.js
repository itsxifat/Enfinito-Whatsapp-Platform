'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(ts) {
  if (!ts) return null
  const diff = Math.floor((Date.now() / 1000) - ts)
  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function extractVars(components) {
  const vars = []
  for (const c of components) {
    if ((c.type === 'BODY' || c.type === 'HEADER') && c.text) {
      const matches = [...c.text.matchAll(/\{\{(\d+)\}\}/g)]
      for (const m of matches) {
        const key = `${c.type.toLowerCase()}_${m[1]}`
        if (!vars.find(v => v.key === key)) {
          vars.push({ key, label: `${c.type === 'BODY' ? 'Body' : 'Header'} {{${m[1]}}}`, component: c.type.toLowerCase(), index: parseInt(m[1]) })
        }
      }
    }
    if (c.type === 'BUTTONS' && c.buttons) {
      c.buttons.forEach((btn, i) => {
        if (btn.type === 'URL' && btn.url?.includes('{{1}}')) {
          vars.push({ key: `button_${i}_url`, label: `Button "${btn.text}" — URL suffix`, component: 'button', index: i, btnType: 'url' })
        } else if (btn.type === 'QUICK_REPLY') {
          vars.push({ key: `button_${i}_payload`, label: `Button "${btn.text}" — payload`, component: 'button', index: i, btnType: 'quick_reply' })
        }
      })
    }
  }
  return vars.sort((a, b) => a.component.localeCompare(b.component) || a.index - b.index)
}

function renderPreview(text, vals) {
  return text.replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const v = vals[`body_${n}`] || vals[`header_${n}`] || ''
    return v ? `[${v}]` : `{{${n}}}`
  })
}

function buildTemplatePayload(tpl, vals) {
  const components = []
  const bodyComp = tpl.components.find(c => c.type === 'BODY')
  const headerComp = tpl.components.find(c => c.type === 'HEADER' && c.format === 'TEXT')
  const buttonsComp = tpl.components.find(c => c.type === 'BUTTONS')

  if (headerComp && headerComp.text?.match(/\{\{\d+\}\}/)) {
    const params = [...headerComp.text.matchAll(/\{\{(\d+)\}\}/g)].map(m => ({
      type: 'text', text: vals[`header_${m[1]}`] || ''
    }))
    if (params.length) components.push({ type: 'header', parameters: params })
  }

  if (bodyComp && bodyComp.text?.match(/\{\{\d+\}\}/)) {
    const params = [...bodyComp.text.matchAll(/\{\{(\d+)\}\}/g)].map(m => ({
      type: 'text', text: vals[`body_${m[1]}`] || ''
    }))
    if (params.length) components.push({ type: 'body', parameters: params })
  }

  if (buttonsComp?.buttons) {
    buttonsComp.buttons.forEach((btn, i) => {
      if (btn.type === 'URL' && btn.url?.includes('{{1}}')) {
        components.push({
          type: 'button',
          sub_type: 'url',
          index: String(i),
          parameters: [{ type: 'text', text: vals[`button_${i}_url`] || '' }],
        })
      } else if (btn.type === 'QUICK_REPLY') {
        const payload = vals[`button_${i}_payload`]
        if (payload) {
          components.push({
            type: 'button',
            sub_type: 'quick_reply',
            index: String(i),
            parameters: [{ type: 'payload', payload }],
          })
        }
      }
    })
  }

  return {
    type: 'template',
    template: {
      name: tpl.name,
      language: { code: tpl.language },
      ...(components.length ? { components } : {}),
    },
  }
}

// ─── Status + category badges ────────────────────────────────────────────────

const STATUS_STYLE = {
  APPROVED: { bg: 'rgba(37,211,102,0.12)', border: 'rgba(37,211,102,0.3)', color: '#4ade80', dot: '#25d366' },
  PENDING:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#fbbf24', dot: '#f59e0b' },
  REJECTED: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',  color: '#f87171', dot: '#ef4444' },
  PAUSED:   { bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.3)', color: '#9ca3af', dot: '#6b7280' },
  IN_APPEAL:{ bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)', color: '#93c5fd', dot: '#60a5fa' },
}
const CAT_STYLE = {
  MARKETING:      { bg: 'rgba(168,85,247,0.1)', color: '#c084fc' },
  UTILITY:        { bg: 'rgba(96,165,250,0.1)', color: '#93c5fd' },
  AUTHENTICATION: { bg: 'rgba(251,146,60,0.1)', color: '#fb923c' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.PAUSED
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'11px', fontWeight:600, padding:'3px 8px', borderRadius:'20px', background:s.bg, border:`1px solid ${s.border}`, color:s.color }}>
      <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:s.dot, display:'inline-block' }} />
      {status}
    </span>
  )
}

function CatBadge({ category }) {
  const s = CAT_STYLE[category] || { bg:'rgba(255,255,255,0.05)', color:'var(--text-dim)' }
  return (
    <span style={{ fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'4px', background:s.bg, color:s.color, letterSpacing:'0.05em' }}>
      {category}
    </span>
  )
}

// ─── Template card ───────────────────────────────────────────────────────────

function TemplateCard({ tpl, instanceId, onSent }) {
  const [open, setOpen]     = useState(false)
  const [to, setTo]         = useState('')
  const [vals, setVals]     = useState({})
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const bodyComp   = tpl.components.find(c => c.type === 'BODY')
  const headerComp = tpl.components.find(c => c.type === 'HEADER')
  const footerComp = tpl.components.find(c => c.type === 'FOOTER')
  const buttonsComp= tpl.components.find(c => c.type === 'BUTTONS')
  const vars       = extractVars(tpl.components)

  const previewBody   = bodyComp?.text   ? renderPreview(bodyComp.text, vals)   : null
  const previewHeader = headerComp?.text ? renderPreview(headerComp.text, vals) : null

  async function handleSend(e) {
    e.preventDefault()
    setSending(true)
    setResult(null)
    try {
      const payload = buildTemplatePayload(tpl, vals)
      const res  = await fetch(`/api/instances/${instanceId}/test-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, ...payload }),
      })
      const data = await res.json()
      setResult({ success: data.success, data })
      if (data.success && onSent) onSent()
    } catch (err) {
      setResult({ success: false, data: { error: err.message } })
    } finally {
      setSending(false) }
  }

  function copyResult() {
    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background:'var(--bg-card)', border:`1px solid ${open ? 'rgba(37,211,102,0.3)' : 'var(--border)'}`, borderRadius:'12px', overflow:'hidden', transition:'border-color 0.2s' }}>
      {/* Card header */}
      <div style={{ padding:'20px', cursor:'pointer' }} onClick={() => { setOpen(o => !o); setResult(null) }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
            <StatusBadge status={tpl.status} />
            <CatBadge category={tpl.category} />
            <span style={{ fontSize:'11px', color:'var(--text-dim)', background:'#0d0d0d', padding:'2px 7px', borderRadius:'4px', border:'1px solid var(--border)' }}>
              {tpl.language}
            </span>
          </div>
          <span style={{ fontSize:'18px', color:'var(--text-dim)', transition:'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', lineHeight:1 }}>⌄</span>
        </div>
        <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', marginBottom:'8px', letterSpacing:'-0.01em' }}>
          {tpl.name}
        </div>
        {bodyComp?.text && (
          <div style={{ fontSize:'12px', color:'var(--text-muted)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {bodyComp.text}
          </div>
        )}
      </div>

      {/* Expanded send panel */}
      {open && (
        <div style={{ borderTop:'1px solid var(--border)', padding:'20px', background:'rgba(37,211,102,0.02)' }}>

          {/* Template preview */}
          <div style={{ background:'#0d0d0d', border:'1px solid var(--border)', borderRadius:'10px', padding:'16px', marginBottom:'20px' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text-dim)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'10px' }}>Preview</div>

            {headerComp && (
              <div style={{ marginBottom:'8px' }}>
                {headerComp.format === 'TEXT' ? (
                  <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{previewHeader || headerComp.text}</div>
                ) : (
                  <div style={{ fontSize:'12px', color:'var(--text-dim)', fontStyle:'italic' }}>
                    [{headerComp.format} header]
                  </div>
                )}
              </div>
            )}

            {bodyComp && (
              <div style={{ fontSize:'13px', color:'var(--text-muted)', lineHeight:1.7, whiteSpace:'pre-wrap', marginBottom:footerComp ? '8px' : 0 }}>
                {previewBody || bodyComp.text}
              </div>
            )}

            {footerComp && (
              <div style={{ fontSize:'11px', color:'var(--text-dim)', marginTop:'6px', borderTop:'1px solid var(--border-subtle)', paddingTop:'6px' }}>
                {footerComp.text}
              </div>
            )}

            {buttonsComp?.buttons && (
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'10px', paddingTop:'10px', borderTop:'1px solid var(--border-subtle)' }}>
                {buttonsComp.buttons.map((btn, i) => {
                  const icon = btn.type === 'URL' ? '🔗' : btn.type === 'PHONE_NUMBER' ? '📞' : btn.type === 'QUICK_REPLY' ? '↩' : ''
                  return (
                    <div key={i} style={{ fontSize:'12px', color:'var(--accent)', background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', borderRadius:'6px', padding:'4px 10px', fontWeight:500, display:'flex', alignItems:'center', gap:'4px' }}>
                      {icon && <span style={{ fontSize:'11px' }}>{icon}</span>}
                      {btn.text}
                      {btn.type === 'URL' && btn.url?.includes('{{1}}') && <span style={{ fontSize:'10px', color:'#fbbf24', marginLeft:'2px' }}>*</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Send form */}
          {tpl.status !== 'APPROVED' && (
            <div style={{ background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', fontSize:'12px', color:'#fbbf24' }}>
              ⚠ This template is <strong>{tpl.status}</strong>. Only APPROVED templates can be sent.
            </div>
          )}

          <form onSubmit={handleSend}>
            <div style={{ marginBottom:'14px' }}>
              <label className="label">Recipient phone number</label>
              <input className="input mono" placeholder="+8801234567890" value={to} onChange={e => setTo(e.target.value)} required style={{ fontSize:'13px' }} />
            </div>

            {vars.length > 0 && (
              <div style={{ marginBottom:'14px' }}>
                <div style={{ fontSize:'12px', fontWeight:600, color:'var(--text-dim)', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'10px' }}>
                  Template Variables
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'10px' }}>
                  {vars.map(v => (
                    <div key={v.key}>
                      <label className="label" style={{ fontSize:'11px' }}>{v.label}</label>
                      <input className="input" placeholder={`Value for ${v.label}`} value={vals[v.key] || ''} onChange={e => setVals(p => ({ ...p, [v.key]: e.target.value }))} style={{ fontSize:'13px' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={sending || tpl.status !== 'APPROVED'} style={{ minWidth:'140px' }}>
              {sending ? 'Sending...' : '▶ Send template'}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div style={{ marginTop:'16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                <span style={{ fontSize:'12px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', background: result.success ? 'rgba(37,211,102,0.12)' : 'rgba(239,68,68,0.1)', color: result.success ? 'var(--accent)' : 'var(--red)', border:`1px solid ${result.success ? 'rgba(37,211,102,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  {result.success ? '✓ Sent successfully' : '✗ Failed'}
                </span>
                <button onClick={copyResult} style={{ fontSize:'11px', padding:'4px 10px', borderRadius:'6px', cursor:'pointer', background: copied ? 'rgba(37,211,102,0.1)' : 'var(--bg)', border:`1px solid ${copied ? 'rgba(37,211,102,0.3)' : 'var(--border)'}`, color: copied ? 'var(--accent)' : 'var(--text-dim)' }}>
                  {copied ? '✓ Copied' : '⎘ Copy'}
                </button>
              </div>
              {!result.success && result.data?.error && (
                <div style={{ fontSize:'12px', color:'#fca5a5', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', padding:'10px 14px', marginBottom:'8px', lineHeight:1.6 }}>
                  {result.data.error}
                  {result.data.fbtrace_id && <span style={{ display:'block', marginTop:'4px', fontFamily:'monospace', fontSize:'11px', color:'var(--text-dim)' }}>fbtrace_id: {result.data.fbtrace_id}</span>}
                </div>
              )}
              <pre style={{ background:'#0a0a0a', border:'1px solid var(--border)', borderRadius:'8px', padding:'12px 14px', fontSize:'11px', lineHeight:1.7, overflow:'auto', color: result.success ? '#86efac' : '#fca5a5', fontFamily:'monospace', maxHeight:'160px', margin:0 }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

const STATUSES   = ['ALL', 'APPROVED', 'PENDING', 'REJECTED', 'PAUSED']
const CATEGORIES = ['ALL', 'MARKETING', 'UTILITY', 'AUTHENTICATION']

export default function TemplatesPage() {
  const { id } = useParams()

  const [templates, setTemplates] = useState([])
  const [loading, setLoading]     = useState(true)
  const [syncing, setSyncing]     = useState(false)
  const [syncedAt, setSyncedAt]   = useState(null)
  const [syncError, setSyncError] = useState('')
  const [filterStatus, setFilterStatus]   = useState('ALL')
  const [filterCat,    setFilterCat]      = useState('ALL')
  const [search, setSearch]               = useState('')

  const loadTemplates = useCallback(async (sync = false) => {
    if (sync) setSyncing(true); else setLoading(true)
    setSyncError('')
    try {
      const res  = await fetch(`/api/instances/${id}/templates${sync ? '?sync=1' : ''}`)
      const data = await res.json()
      if (!res.ok) { setSyncError(data.error || 'Failed to load templates.'); return }
      setTemplates(data.templates || [])
      if (sync && data.synced) setSyncedAt(Math.floor(Date.now() / 1000))
    } catch {
      setSyncError('Network error.')
    } finally {
      setLoading(false); setSyncing(false)
    }
  }, [id])

  useEffect(() => { loadTemplates(false) }, [loadTemplates])

  const visible = templates.filter(t => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false
    if (filterCat    !== 'ALL' && t.category !== filterCat)  return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    approved: templates.filter(t => t.status === 'APPROVED').length,
    pending:  templates.filter(t => t.status === 'PENDING').length,
    rejected: templates.filter(t => t.status === 'REJECTED').length,
  }

  return (
    <div style={{ maxWidth:'900px' }}>

      {/* Header */}
      <div style={{ marginBottom:'28px' }}>
        <Link href={`/instances/${id}`} style={{ fontSize:'13px', color:'var(--text-muted)', textDecoration:'none' }}>
          ← Back to instance
        </Link>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginTop:'16px' }}>
          <div>
            <h1 style={{ fontSize:'22px', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'4px' }}>Message Templates</h1>
            <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>
              Templates let you send the first message to any user — no prior conversation needed
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
            {syncedAt && <span style={{ fontSize:'11px', color:'var(--text-dim)' }}>Synced {timeAgo(syncedAt)}</span>}
            <button onClick={() => loadTemplates(true)} disabled={syncing} className="btn-primary" style={{ fontSize:'13px', padding:'8px 16px' }}>
              {syncing ? 'Syncing...' : '↻ Sync from Meta'}
            </button>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background:'rgba(96,165,250,0.06)', border:'1px solid rgba(96,165,250,0.2)', borderRadius:'10px', padding:'14px 18px', marginBottom:'24px', fontSize:'13px', color:'#93c5fd', lineHeight:1.7 }}>
        <strong>How templates work:</strong> Create templates in <strong>Meta Business Manager → WhatsApp Manager → Message Templates</strong>.
        After Meta approves them (usually 24–48h), click <strong>Sync from Meta</strong> above to import them here.
        Only <span style={{ color:'#4ade80', fontWeight:600 }}>APPROVED</span> templates can be sent to users who haven't messaged you first.
      </div>

      {syncError && (
        <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'10px', padding:'12px 16px', marginBottom:'20px', fontSize:'13px', color:'var(--red)' }}>
          {syncError}
        </div>
      )}

      {/* Stats row */}
      {templates.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px', marginBottom:'24px' }}>
          {[
            { label:'Approved', value:counts.approved, color:'#4ade80',  bg:'rgba(37,211,102,0.08)',  border:'rgba(37,211,102,0.2)' },
            { label:'Pending',  value:counts.pending,  color:'#fbbf24',  bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.2)' },
            { label:'Rejected', value:counts.rejected, color:'#f87171',  bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.2)'  },
          ].map(s => (
            <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:'10px', padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'13px', color:s.color, fontWeight:600 }}>{s.label}</span>
              <span style={{ fontSize:'24px', fontWeight:800, color:s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {templates.length > 0 && (
        <div style={{ display:'flex', gap:'10px', marginBottom:'20px', flexWrap:'wrap', alignItems:'center' }}>
          <input className="input" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize:'13px', maxWidth:'220px', flex:1 }} />
          <div style={{ display:'flex', gap:'4px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'3px' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ fontSize:'11px', fontWeight:600, padding:'5px 10px', borderRadius:'6px', border:'none', cursor:'pointer', background: filterStatus === s ? 'var(--accent)' : 'transparent', color: filterStatus === s ? '#000' : 'var(--text-dim)', transition:'all 0.12s' }}>
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:'4px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'3px' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilterCat(c)} style={{ fontSize:'11px', fontWeight:600, padding:'5px 10px', borderRadius:'6px', border:'none', cursor:'pointer', background: filterCat === c ? '#a78bfa' : 'transparent', color: filterCat === c ? '#fff' : 'var(--text-dim)', transition:'all 0.12s' }}>
                {c === 'ALL' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Template list */}
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px', opacity: 1 - i * 0.2 }}>
              <div style={{ height:'12px', background:'var(--border)', borderRadius:'4px', width:'60px', marginBottom:'12px' }} />
              <div style={{ height:'16px', background:'var(--border)', borderRadius:'4px', width:'180px', marginBottom:'10px' }} />
              <div style={{ height:'12px', background:'var(--border)', borderRadius:'4px', width:'100%' }} />
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px' }}>
          <div style={{ fontSize:'40px', marginBottom:'16px' }}>📋</div>
          <h3 style={{ fontSize:'16px', fontWeight:600, marginBottom:'8px' }}>No templates yet</h3>
          <p style={{ fontSize:'13px', color:'var(--text-muted)', lineHeight:1.7, maxWidth:'400px', margin:'0 auto 20px' }}>
            Create templates in Meta Business Manager first, then click <strong>Sync from Meta</strong> to import them here.
          </p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
            <button onClick={() => loadTemplates(true)} disabled={syncing} className="btn-primary" style={{ fontSize:'13px' }}>
              {syncing ? 'Syncing...' : '↻ Sync from Meta'}
            </button>
          </div>
          <div style={{ marginTop:'24px', background:'rgba(96,165,250,0.05)', border:'1px solid rgba(96,165,250,0.15)', borderRadius:'10px', padding:'16px', textAlign:'left', maxWidth:'500px', margin:'24px auto 0' }}>
            <div style={{ fontSize:'12px', fontWeight:600, color:'#93c5fd', marginBottom:'8px' }}>How to create a template in Meta:</div>
            {['Go to business.facebook.com → WhatsApp Manager', 'Click "Message Templates" → Create Template', 'Choose category (Marketing, Utility, or Authentication)', 'Write your message — use {{1}}, {{2}} for variables', 'Submit for review — Meta approves within 24–48 hours', 'Come back and click Sync from Meta'].map((step, i) => (
              <div key={i} style={{ display:'flex', gap:'10px', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', lineHeight:1.5 }}>
                <span style={{ width:'18px', height:'18px', borderRadius:'50%', background:'rgba(96,165,250,0.15)', color:'#93c5fd', fontSize:'10px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:'14px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px' }}>
          No templates match your filters.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {visible.map(tpl => (
            <TemplateCard key={tpl._id || tpl.meta_id} tpl={tpl} instanceId={id} onSent={() => {}} />
          ))}
        </div>
      )}
    </div>
  )
}

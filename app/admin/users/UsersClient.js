'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const PLAN_OPTIONS = ['free', 'pro']
const ROLE_OPTIONS = ['user', 'admin']

function UserRow({ user, currentUserId, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    name: user.name,
    plan: user.plan,
    role: user.role,
    is_approved: Boolean(user.is_approved),
    max_instances: user.max_instances === null ? '' : String(user.max_instances),
  })

  async function save() {
    setSaving(true)
    setMsg('')
    try {
      const body = {
        name: form.name,
        plan: form.plan,
        role: form.role,
        is_approved: form.is_approved,
        max_instances: form.max_instances === '' ? null : parseInt(form.max_instances, 10),
      }
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Failed.'); return }
      setMsg('Saved!')
      setEditing(false)
      onUpdate(user.id, body)
    } catch {
      setMsg('Network error.')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handleApprove() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: true }),
      })
      const data = await res.json()
      if (res.ok) onUpdate(user.id, { is_approved: true })
      else setMsg(data.error || 'Failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleRevoke() {
    if (!confirm(`Revoke access for ${user.name}?`)) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: false }),
      })
      const data = await res.json()
      if (res.ok) onUpdate(user.id, { is_approved: false })
      else setMsg(data.error || 'Failed.')
    } finally {
      setSaving(false)
    }
  }

  const isSelf = user.id === currentUserId

  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <td style={{ padding: '14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, color: '#000', flexShrink: 0,
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>
              {user.name} {isSelf && <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>(you)</span>}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{user.email}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 12px' }}>
        <span className={`badge ${user.auth_provider === 'google' ? 'badge-yellow' : 'badge-gray'}`}>
          {user.auth_provider === 'google' ? '🔵 Google' : '📧 Email'}
        </span>
      </td>
      <td style={{ padding: '14px 12px' }}>
        {user.is_approved ? (
          <span className="badge badge-green">● Approved</span>
        ) : (
          <span className="badge badge-yellow">⏳ Pending</span>
        )}
      </td>
      <td style={{ padding: '14px 12px' }}>
        <span className={`badge ${user.role === 'admin' ? 'badge-yellow' : 'badge-gray'}`}>
          {user.role}
        </span>
      </td>
      <td style={{ padding: '14px 12px', fontSize: '13px', color: 'var(--text-muted)' }}>
        {user.plan} · {user.max_instances !== null ? user.max_instances : 'auto'} inst.
        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{user.instance_count} active</div>
      </td>
      <td style={{ padding: '14px 12px', fontSize: '12px', color: 'var(--text-dim)' }}>
        {new Date(user.created_at * 1000).toLocaleDateString()}
      </td>
      <td style={{ padding: '14px 12px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {!user.is_approved && !isSelf && (
            <button onClick={handleApprove} disabled={saving} className="btn-primary" style={{ padding: '5px 10px', fontSize: '11px' }}>
              Approve
            </button>
          )}
          {user.is_approved && !isSelf && (
            <button onClick={handleRevoke} disabled={saving} className="btn-danger" style={{ padding: '5px 10px', fontSize: '11px' }}>
              Revoke
            </button>
          )}
          <button onClick={() => setEditing(!editing)} className="btn-ghost" style={{ padding: '5px 10px', fontSize: '11px' }}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {msg && <div style={{ fontSize: '11px', marginTop: '4px', color: msg === 'Saved!' ? 'var(--accent)' : 'var(--red)' }}>{msg}</div>}
      </td>

      {editing && (
        <td colSpan={7} style={{ padding: '0 12px 16px', background: 'var(--bg)' }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '16px', marginTop: '8px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px',
          }}>
            <div>
              <label className="label">Name</label>
              <input className="input" style={{ fontSize: '13px', padding: '7px 10px' }}
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Plan</label>
              <select className="input" style={{ fontSize: '13px', padding: '7px 10px' }}
                value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                {PLAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" style={{ fontSize: '13px', padding: '7px 10px' }}
                value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                disabled={isSelf}>
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Max Instances <span style={{ color: 'var(--text-dim)' }}>(blank=auto)</span></label>
              <input className="input" style={{ fontSize: '13px', padding: '7px 10px' }}
                type="number" min={0} max={1000} placeholder="auto"
                value={form.max_instances} onChange={e => setForm(f => ({ ...f, max_instances: e.target.value }))} />
            </div>
            <div>
              <label className="label">Approved</label>
              <select className="input" style={{ fontSize: '13px', padding: '7px 10px' }}
                value={form.is_approved ? 'yes' : 'no'}
                onChange={e => setForm(f => ({ ...f, is_approved: e.target.value === 'yes' }))}
                disabled={isSelf}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px' }}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </td>
      )}
    </tr>
  )
}

function UsersTable({ initialUsers, currentUserId, highlight }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  function handleUpdate(id, patch) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u))
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ||
      (filter === 'pending' && !u.is_approved) ||
      (filter === 'approved' && u.is_approved) ||
      (filter === 'admin' && u.role === 'admin')
    return matchSearch && matchFilter
  })

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input"
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '260px', fontSize: '13px' }}
        />
        {['all', 'pending', 'approved', 'admin'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
              border: '1px solid', cursor: 'pointer',
              background: filter === f ? 'var(--accent)' : 'transparent',
              color: filter === f ? '#000' : 'var(--text-muted)',
              borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {f === 'all' ? `All (${users.length})` :
             f === 'pending' ? `Pending (${users.filter(u => !u.is_approved).length})` :
             f === 'approved' ? `Approved (${users.filter(u => u.is_approved).length})` :
             `Admin (${users.filter(u => u.role === 'admin').length})`}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              {['User', 'Auth', 'Status', 'Role', 'Plan / Instances', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '12px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-dim)', fontSize: '13px' }}>
                  No users match your filter
                </td>
              </tr>
            ) : filtered.map(u => (
              <UserRow
                key={u.id}
                user={u}
                currentUserId={currentUserId}
                onUpdate={handleUpdate}
                highlight={u.id === highlight}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsersClientInner({ users, currentUserId }) {
  const searchParams = useSearchParams()
  const highlight = searchParams.get('highlight')

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
          User Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Approve access, manage plans, and control instance limits
        </p>
      </div>
      <UsersTable initialUsers={users} currentUserId={currentUserId} highlight={highlight} />
    </div>
  )
}

export default function UsersClient({ users, currentUserId }) {
  return (
    <Suspense fallback={null}>
      <UsersClientInner users={users} currentUserId={currentUserId} />
    </Suspense>
  )
}

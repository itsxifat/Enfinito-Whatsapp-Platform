'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function InstanceActions({ instanceId }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    setLoading(true)
    await fetch(`/api/instances/${instanceId}`, { method: 'DELETE' })
    router.push('/instances')
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="btn-danger"
      >
        {loading ? 'Deleting...' : confirming ? 'Confirm delete?' : 'Delete'}
      </button>
      {confirming && (
        <button onClick={() => setConfirming(false)} className="btn-ghost" style={{ padding: '8px 12px', fontSize: '13px' }}>
          Cancel
        </button>
      )}
    </div>
  )
}

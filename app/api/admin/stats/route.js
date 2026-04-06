import { NextResponse } from 'next/server'
import { getSession, isAdmin } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'

export async function GET() {
  const session = await getSession()
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const db = await getDb()
  const now = Math.floor(Date.now() / 1000)

  const [
    totalUsers,
    pendingUsers,
    approvedUsers,
    adminUsers,
    googleUsers,
    totalInstances,
    connectedInstances,
    totalKeys,
    totalMessages,
    messagesLast24h,
  ] = await Promise.all([
    db.collection('users').countDocuments({ is_active: true }),
    db.collection('users').countDocuments({ is_approved: false, is_active: true }),
    db.collection('users').countDocuments({ is_approved: true, is_active: true }),
    db.collection('users').countDocuments({ role: 'admin', is_active: true }),
    db.collection('users').countDocuments({ auth_provider: 'google', is_active: true }),
    db.collection('whatsapp_instances').countDocuments({ is_active: true }),
    db.collection('whatsapp_instances').countDocuments({ is_active: true, is_connected: true }),
    db.collection('api_keys').countDocuments({ is_active: true }),
    db.collection('messages_log').countDocuments(),
    db.collection('messages_log').countDocuments({ created_at: { $gt: now - 86400 } }),
  ])

  return NextResponse.json({
    stats: {
      users:     { total: totalUsers, pending: pendingUsers, approved: approvedUsers, admin: adminUsers, google: googleUsers },
      instances: { total: totalInstances, connected: connectedInstances },
      keys:      { total: totalKeys },
      messages:  { total: totalMessages, last24h: messagesLast24h },
    },
  })
}

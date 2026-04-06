import { getDb } from './db.js'
import { hashApiKey } from './crypto.js'
import { apiKeyRateLimit } from './ratelimit.js'
import { NextResponse } from 'next/server'

export async function validateApiKey(request) {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')

  if (!apiKey) {
    return { error: NextResponse.json({ error: 'Missing API key. Include X-API-Key header.' }, { status: 401 }) }
  }

  if (!apiKey.startsWith('enf_live_')) {
    return { error: NextResponse.json({ error: 'Invalid API key format.' }, { status: 401 }) }
  }

  const keyHash = hashApiKey(apiKey)

  // Rate limit check
  const limit = await apiKeyRateLimit(keyHash)
  if (!limit.allowed) {
    return {
      error: NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.', retryAfter: limit.retryAfter },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      )
    }
  }

  const db = await getDb()

  const [keyRow] = await db.collection('api_keys').aggregate([
    { $match: { key_hash: keyHash, is_active: true } },
    {
      $lookup: {
        from: 'whatsapp_instances',
        localField: 'instance_id',
        foreignField: '_id',
        as: 'instance',
      },
    },
    { $unwind: '$instance' },
    { $match: { 'instance.is_active': true } },
    {
      $addFields: {
        instance_id:               '$instance._id',
        phone_number_id_encrypted: '$instance.phone_number_id_encrypted',
        access_token_encrypted:    '$instance.access_token_encrypted',
        app_secret_encrypted:      '$instance.app_secret_encrypted',
        app_id_encrypted:          '$instance.app_id_encrypted',
        is_connected:              '$instance.is_connected',
        waba_id_encrypted:         '$instance.waba_id_encrypted',
        webhook_verify_token:      '$instance.webhook_verify_token',
      },
    },
    { $project: { instance: 0 } },
  ]).toArray()

  if (!keyRow) {
    return { error: NextResponse.json({ error: 'Invalid or revoked API key.' }, { status: 401 }) }
  }

  // Update last used (best-effort, non-blocking)
  db.collection('api_keys').updateOne(
    { key_hash: keyHash },
    { $set: { last_used_at: Math.floor(Date.now() / 1000) } }
  ).catch(() => {})

  return { keyRow }
}

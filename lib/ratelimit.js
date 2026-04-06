import { getDb } from './db.js'

export async function rateLimit(key, maxRequests, windowSeconds) {
  const db = await getDb()
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - windowSeconds

  // Atomically increment if within current window
  const existing = await db.collection('rate_limits').findOneAndUpdate(
    { _id: key, window_start: { $gte: windowStart } },
    { $inc: { count: 1 } },
    { returnDocument: 'after' }
  )

  if (existing) {
    if (existing.count > maxRequests) {
      return { allowed: false, remaining: 0, retryAfter: existing.window_start + windowSeconds - now }
    }
    return { allowed: true, remaining: maxRequests - existing.count }
  }

  // Expired window or new key — reset
  await db.collection('rate_limits').updateOne(
    { _id: key },
    { $set: { count: 1, window_start: now } },
    { upsert: true }
  )
  return { allowed: true, remaining: maxRequests - 1 }
}

export async function apiKeyRateLimit(keyHash) {
  return rateLimit(`api:${keyHash}`, 100, 60)
}

export async function authRateLimit(ip) {
  return rateLimit(`auth:${ip}`, 10, 60)
}

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI environment variable is not set')

let clientPromise

if (process.env.NODE_ENV === 'development') {
  // Reuse connection across hot-reloads in dev
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  const client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb() {
  const client = await clientPromise
  return client.db()
}

// Map MongoDB _id back to id for callers that expect .id
export function doc(d) {
  if (!d) return null
  const { _id, ...rest } = d
  return { id: String(_id), ...rest }
}

// Ensure indexes on first use (idempotent)
let indexesEnsured = false
export async function ensureIndexes() {
  if (indexesEnsured) return
  indexesEnsured = true
  const db = await getDb()

  await db.collection('users').createIndexes([
    { key: { email_hash: 1 }, unique: true },
    { key: { google_id: 1 }, unique: true, sparse: true },
    { key: { created_at: 1 } },
  ])
  await db.collection('password_reset_tokens').createIndexes([
    { key: { token_hash: 1 }, unique: true },
    { key: { user_id: 1 } },
    { key: { expires_at: 1 } },
  ])
  await db.collection('whatsapp_instances').createIndexes([
    { key: { user_id: 1 } },
  ])
  await db.collection('api_keys').createIndexes([
    { key: { key_hash: 1 }, unique: true },
    { key: { user_id: 1 } },
    { key: { instance_id: 1 } },
  ])
  await db.collection('messages_log').createIndexes([
    { key: { instance_id: 1 } },
    { key: { wamid: 1 }, sparse: true },
    { key: { created_at: 1 } },
  ])
}

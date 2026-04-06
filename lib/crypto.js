import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const TAG_LENGTH = 16
const KEY_LENGTH = 32

function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error('ENCRYPTION_KEY environment variable is not set')
  const buf = Buffer.from(key, 'hex')
  if (buf.length !== KEY_LENGTH) throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)')
  return buf
}

export function encrypt(plaintext) {
  if (!plaintext) return null
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

export function decrypt(ciphertext) {
  if (!ciphertext) return null
  const key = getEncryptionKey()
  const buf = Buffer.from(ciphertext, 'base64')
  const iv = buf.subarray(0, IV_LENGTH)
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
  const encrypted = buf.subarray(IV_LENGTH + TAG_LENGTH)
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  return decipher.update(encrypted) + decipher.final('utf8')
}

export function hashApiKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export function generateApiKey() {
  const prefix = 'enf_live_'
  const secret = crypto.randomBytes(32).toString('base64url')
  return prefix + secret
}

export function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

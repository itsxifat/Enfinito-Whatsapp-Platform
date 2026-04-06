import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth.js'
import { getDb } from '@/lib/db.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AVATARS_DIR = path.join(__dirname, '..', '..', '..', '..', 'public', 'avatars')

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

if (!fs.existsSync(AVATARS_DIR)) fs.mkdirSync(AVATARS_DIR, { recursive: true })

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  let formData
  try { formData = await request.formData() } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const file = formData.get('avatar')
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Image must be smaller than 2 MB.' }, { status: 400 })
  }

  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const filename = `${session.sub}.${ext}`
  const filepath = path.join(AVATARS_DIR, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(filepath, buffer)

  const avatarUrl = `/avatars/${filename}`

  const db = await getDb()
  await db.collection('users').updateOne({ _id: session.sub }, { $set: { avatar_url: avatarUrl } })

  return NextResponse.json({ message: 'Avatar updated.', avatarUrl })
}

export async function DELETE() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const db = await getDb()
  const user = await db.collection('users').findOne({ _id: session.sub }, { projection: { avatar_url: 1 } })

  if (user?.avatar_url && user.avatar_url.startsWith('/avatars/')) {
    const filepath = path.join(AVATARS_DIR, path.basename(user.avatar_url))
    try { fs.unlinkSync(filepath) } catch { /* already deleted */ }
  }

  await db.collection('users').updateOne({ _id: session.sub }, { $set: { avatar_url: null } })
  return NextResponse.json({ message: 'Avatar removed.' })
}

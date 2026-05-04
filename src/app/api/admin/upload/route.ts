export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { processUpload } from '@/lib/upload'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const module = (formData.get('module') as string) || 'products'
    const id = (formData.get('id') as string) || 'unknown'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
    }

    const maxSize = 20 * 1024 * 1024 // 20 MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max 20 MB.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await processUpload(buffer, module, id, file.name)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[POST /api/admin/upload]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

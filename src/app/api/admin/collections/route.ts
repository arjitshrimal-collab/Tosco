export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const collections = await prisma.collection.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, name: true, slug: true, isActive: true },
  })

  return NextResponse.json({ collections })
}

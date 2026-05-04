export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { isRead: true },
    })
    return NextResponse.json({ success: true, inquiry })
  } catch {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
  }
}

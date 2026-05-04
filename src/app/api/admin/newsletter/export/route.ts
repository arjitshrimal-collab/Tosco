export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const header = 'id,email,name,subscribed_at\n'
  const rows = subscribers
    .map(
      (s) =>
        `${s.id},${csvEscape(s.email)},${csvEscape(s.name ?? '')},${s.createdAt.toISOString()}`
    )
    .join('\n')

  const csv = header + rows

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="tosco-newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

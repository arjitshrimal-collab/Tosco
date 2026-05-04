export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
  return Response.json(testimonials)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const testimonial = await prisma.testimonial.create({ data: body })
  return Response.json(testimonial, { status: 201 })
}

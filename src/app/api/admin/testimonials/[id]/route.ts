export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const t = await prisma.testimonial.update({ where: { id }, data: body })
  return Response.json(t)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.testimonial.delete({ where: { id } })
  return Response.json({ success: true })
}

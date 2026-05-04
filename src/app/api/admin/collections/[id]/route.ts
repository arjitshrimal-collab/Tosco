export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const collection = await prisma.collection.findUnique({ where: { id }, include: { products: true } })
  if (!collection) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(collection)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const collection = await prisma.collection.update({ where: { id }, data: body })
  return Response.json(collection)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.collection.delete({ where: { id } })
  return Response.json({ success: true })
}

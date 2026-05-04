import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const post = await prisma.journalPost.findUnique({ where: { id } })
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(post)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const post = await prisma.journalPost.update({ where: { id }, data: body })
  return Response.json(post)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.journalPost.delete({ where: { id } })
  return Response.json({ success: true })
}

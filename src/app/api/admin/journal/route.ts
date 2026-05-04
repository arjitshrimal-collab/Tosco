import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const posts = await prisma.journalPost.findMany({ orderBy: { createdAt: 'desc' } })
  return Response.json(posts)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.slug) body.slug = slugify(body.title || '')
  const post = await prisma.journalPost.create({ data: body })
  return Response.json(post, { status: 201 })
}

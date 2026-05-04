import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      collection: { select: { name: true, slug: true } },
    },
  })

  if (!product) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Increment view count (fire and forget)
  prisma.product.update({ where: { id: product.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  return Response.json(product)
}

export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const collection = searchParams.get('collection')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '24')

  const products = await prisma.product.findMany({
    where: {
      inStock: true,
      ...(category ? { category } : {}),
      ...(featured === 'true' ? { isFeatured: true } : {}),
      ...(collection ? { collection: { slug: collection } } : {}),
      ...(search ? { name: { contains: search } } : {}),
    },
    include: {
      images: { orderBy: { order: 'asc' } },
      collection: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return Response.json(products)
}

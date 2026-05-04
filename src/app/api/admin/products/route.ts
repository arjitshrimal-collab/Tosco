import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '50', 10)
  const skip = (page - 1) * limit

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { category: { contains: search } },
          { slug: { contains: search } },
        ],
      }
    : {}

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        collection: { select: { id: true, name: true } },
        _count: { select: { inquiries: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, limit })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const {
      name,
      slug: rawSlug,
      category,
      description,
      price,
      showPrice,
      specs,
      isFeatured,
      inStock,
      seoTitle,
      seoDescription,
      collectionId,
      images,
    } = body

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }

    let slug = rawSlug?.trim() || slugify(name)

    // Ensure slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        description: description ?? null,
        price: price ? parseFloat(price) : null,
        showPrice: showPrice ?? false,
        specs: specs ? JSON.stringify(specs) : null,
        isFeatured: isFeatured ?? false,
        inStock: inStock ?? true,
        seoTitle: seoTitle ?? null,
        seoDescription: seoDescription ?? null,
        collectionId: collectionId || null,
      },
    })

    // Create image records if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map(
          (img: { url: string; thumbUrl?: string; mediumUrl?: string; alt?: string; order?: number; isPrimary?: boolean }, idx: number) => ({
            productId: product.id,
            url: img.url,
            thumbUrl: img.thumbUrl ?? null,
            mediumUrl: img.mediumUrl ?? null,
            alt: img.alt ?? null,
            order: img.order ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })
        ),
      })
    }

    const created = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: { orderBy: { order: 'asc' } }, collection: true },
    })

    return NextResponse.json({ product: created }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/products]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

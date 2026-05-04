export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { slugify } from '@/lib/utils'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      collection: true,
    },
  })

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return NextResponse.json({ product })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

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

    // Check slug uniqueness if slug changed
    let slug = rawSlug?.trim() || (name ? slugify(name) : undefined)
    if (slug) {
      const existing = await prisma.product.findUnique({ where: { slug } })
      if (existing && existing.id !== id) {
        slug = `${slug}-${Date.now()}`
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description: description ?? null }),
        ...(price !== undefined && { price: price ? parseFloat(price) : null }),
        ...(showPrice !== undefined && { showPrice }),
        ...(specs !== undefined && { specs: specs ? JSON.stringify(specs) : null }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(inStock !== undefined && { inStock }),
        ...(seoTitle !== undefined && { seoTitle: seoTitle ?? null }),
        ...(seoDescription !== undefined && { seoDescription: seoDescription ?? null }),
        ...(collectionId !== undefined && { collectionId: collectionId || null }),
      },
    })

    // Handle image updates if provided
    if (images && Array.isArray(images)) {
      // Delete all existing images and recreate from the provided list
      await prisma.productImage.deleteMany({ where: { productId: id } })

      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map(
            (img: { url: string; thumbUrl?: string; mediumUrl?: string; alt?: string; order?: number; isPrimary?: boolean }, idx: number) => ({
              productId: id,
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
    }

    const updated = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: { orderBy: { order: 'asc' } }, collection: true },
    })

    return NextResponse.json({ product: updated })
  } catch (err) {
    console.error('[PATCH /api/admin/products/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    // Images cascade via Prisma schema (onDelete: Cascade)
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/products/[id]]', err)
    return NextResponse.json({ error: 'Product not found or could not be deleted' }, { status: 404 })
  }
}

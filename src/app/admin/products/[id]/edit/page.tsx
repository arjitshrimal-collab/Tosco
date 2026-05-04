import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raw = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  })
  if (!raw) notFound()

  const product = {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    category: raw.category,
    description: raw.description ?? undefined,
    price: raw.price ?? undefined,
    showPrice: raw.showPrice,
    specs: raw.specs ?? undefined,
    isFeatured: raw.isFeatured,
    inStock: raw.inStock,
    seoTitle: raw.seoTitle ?? undefined,
    seoDescription: raw.seoDescription ?? undefined,
    collectionId: raw.collectionId ?? undefined,
    images: raw.images.map((img) => ({
      id: img.id,
      url: img.url,
      thumbUrl: img.thumbUrl ?? undefined,
      mediumUrl: img.mediumUrl ?? undefined,
      alt: img.alt ?? undefined,
      order: img.order,
      isPrimary: img.isPrimary,
    })),
  }

  return <ProductForm product={product} />
}

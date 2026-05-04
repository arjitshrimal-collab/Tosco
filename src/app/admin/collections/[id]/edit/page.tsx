import { prisma } from '@/lib/prisma'
import CollectionForm from '@/components/admin/CollectionForm'
import { notFound } from 'next/navigation'

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raw = await prisma.collection.findUnique({ where: { id } })
  if (!raw) notFound()
  const collection = {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? undefined,
    heroImage: raw.heroImage ?? undefined,
    isActive: raw.isActive,
    order: raw.order,
  }
  return <CollectionForm collection={collection} />
}

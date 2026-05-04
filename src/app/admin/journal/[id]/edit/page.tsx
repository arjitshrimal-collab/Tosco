import { prisma } from '@/lib/prisma'
import JournalPostForm from '@/components/admin/JournalPostForm'
import { notFound } from 'next/navigation'

export default async function EditJournalPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raw = await prisma.journalPost.findUnique({ where: { id } })
  if (!raw) notFound()
  const post = {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt ?? undefined,
    content: raw.content,
    coverImage: raw.coverImage ?? undefined,
    isPublished: raw.isPublished,
    seoTitle: raw.seoTitle ?? undefined,
    seoDescription: raw.seoDescription ?? undefined,
  }
  return <JournalPostForm post={post} />
}

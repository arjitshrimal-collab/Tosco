import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.journalPost.findUnique({ where: { slug, isPublished: true } })
  if (!post) return { title: 'Post Not Found' }
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt || '' }
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params

  const [post, recent] = await Promise.all([
    prisma.journalPost.findUnique({ where: { slug, isPublished: true } }),
    prisma.journalPost.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
  ])

  if (!post) notFound()

  const otherPosts = recent.filter((p) => p.id !== post.id).slice(0, 3)

  return (
    <>
      <Header />
      <main className="pt-20" style={{ background: '#FAF7F2' }}>
        {/* Hero */}
        <section className="relative" style={{ height: '50vh', background: '#1A1A1A' }}>
          {post.coverImage && (
            <Image src={post.coverImage} alt={post.coverImageAlt || post.title} fill className="object-cover opacity-50" />
          )}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-4xl">
            <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.12em' }} className="uppercase font-sans mb-3">
              {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#FAF7F2', lineHeight: 1.1 }} className="text-4xl md:text-6xl font-light">
              {post.title}
            </h1>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Content */}
          <article className="lg:col-span-2">
            {post.excerpt && (
              <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', lineHeight: '1.6', borderLeft: '2px solid #B8935A', paddingLeft: '20px' }} className="text-xl font-light italic mb-8">
                {post.excerpt}
              </p>
            )}
            <div
              className="prose-luxury font-sans text-sm"
              style={{ color: '#2D2D2D', lineHeight: '1.85' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div style={{ borderTop: '1px solid #E8E2D5', marginTop: '40px', paddingTop: '20px' }}>
              <Link href="/journal" style={{ color: '#B8935A', fontSize: '12px', letterSpacing: '0.08em' }} className="uppercase font-sans">
                ← Back to Journal
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          {otherPosts.length > 0 && (
            <aside>
              <p style={{ color: '#9C9080', fontSize: '11px', letterSpacing: '0.1em' }} className="uppercase font-sans mb-6">More Stories</p>
              <div className="space-y-6">
                {otherPosts.map((p) => (
                  <Link key={p.id} href={`/journal/${p.slug}`} className="group block">
                    <p style={{ color: '#B8935A', fontSize: '10px', letterSpacing: '0.08em' }} className="uppercase font-sans">
                      {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-lg font-light mt-1">{p.title}</h3>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

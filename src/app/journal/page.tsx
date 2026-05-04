import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories, guides, and perspectives from the Tosco atelier on fine jewelry, craftsmanship, and life\'s meaningful moments.',
}

export default async function JournalPage() {
  const posts = await prisma.journalPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Header />
      <main className="pt-20" style={{ background: '#FAF7F2' }}>
        <section className="py-16 text-center" style={{ borderBottom: '1px solid #E8E2D5' }}>
          <p style={{ color: '#B8935A', letterSpacing: '0.12em', fontSize: '11px' }} className="uppercase font-sans mb-3">The Atelier Voice</p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-5xl font-light">Journal</h1>
          <p style={{ color: '#9C9080' }} className="mt-4 font-sans text-sm max-w-md mx-auto leading-relaxed">
            Stories of craft, guides to selection, and reflections on the jewelry that marks our most meaningful moments.
          </p>
        </section>

        <section className="py-16 px-6 max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ fontFamily: 'var(--font-cormorant)', color: '#9C9080' }} className="text-3xl font-light italic">New stories coming soon.</p>
              <p style={{ color: '#9C9080' }} className="font-sans text-sm mt-3">Subscribe to our newsletter to be the first to know.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/journal/${post.slug}`} className="group">
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/10', background: '#F2EDE4' }}>
                    <Image
                      src={post.coverImage || `https://placehold.co/640x400/F2EDE4/9C9080?text=${encodeURIComponent(post.title)}`}
                      alt={post.coverImageAlt || post.title}
                      fill
                      className="object-cover"
                      style={{ transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                    />
                  </div>
                  <div className="mt-4">
                    <p style={{ color: '#B8935A', fontSize: '10px', letterSpacing: '0.1em' }} className="uppercase font-sans">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-xl font-light mt-1 group-hover:text-gold" dangerouslySetInnerHTML={{ __html: post.title }} />
                    {post.excerpt && (
                      <p style={{ color: '#9C9080', lineHeight: '1.75' }} className="font-sans text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                    <p style={{ color: '#B8935A', fontSize: '12px', letterSpacing: '0.06em' }} className="uppercase font-sans mt-3">Read more →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

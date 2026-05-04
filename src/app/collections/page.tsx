import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explore our curated collections of fine jewelry — from engagement rings to statement necklaces.',
}

const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bridal', 'Custom']

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const [collections, products] = await Promise.all([
    prisma.collection.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.product.findMany({
      where: {
        inStock: true,
        ...(category ? { category } : {}),
      },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 24,
    }),
  ])

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page header */}
        <section style={{ background: '#FAF7F2', borderBottom: '1px solid #E8E2D5' }} className="py-16 text-center">
          <p style={{ color: '#B8935A', letterSpacing: '0.12em', fontSize: '11px' }} className="uppercase font-sans mb-3">
            Explore
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', letterSpacing: '-0.02em' }} className="text-5xl md:text-6xl font-light">
            Our Collections
          </h1>
          <p style={{ color: '#9C9080' }} className="mt-4 text-base font-sans max-w-xl mx-auto leading-relaxed">
            Each piece is a conversation between craft and desire, tradition and imagination.
          </p>
        </section>

        {/* Collections grid */}
        {collections.length > 0 && (
          <section className="py-16 px-6 max-w-7xl mx-auto">
            <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-3xl font-light mb-10">
              Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => (
                <Link key={col.id} href={`/collections/${col.slug}`} className="group relative overflow-hidden rounded-sm block" style={{ aspectRatio: '3/4' }}>
                  <Image
                    src={col.heroImage || `https://placehold.co/600x800/1A1A1A/B8935A?text=${encodeURIComponent(col.name)}`}
                    alt={col.heroImageAlt || col.name}
                    fill
                    className="object-cover"
                    style={{ transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.8) 0%, rgba(26,26,26,0.1) 60%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 style={{ fontFamily: 'var(--font-cormorant)', color: '#FAF7F2', letterSpacing: '0.02em' }} className="text-2xl font-light">
                      {col.name}
                    </h3>
                    {col.description && (
                      <p style={{ color: '#E8E2D5' }} className="text-sm font-sans mt-1 line-clamp-2">{col.description}</p>
                    )}
                    <span style={{ color: '#B8935A', letterSpacing: '0.1em', fontSize: '11px' }} className="uppercase font-sans mt-3 inline-block">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category filter + products */}
        <section className="py-16 px-6 max-w-7xl mx-auto" style={{ borderTop: '1px solid #E8E2D5' }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-3xl font-light mb-8">
            Shop by Category
          </h2>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/collections"
              style={{
                background: !category ? '#1A1A1A' : 'transparent',
                color: !category ? '#FAF7F2' : '#9C9080',
                border: '1px solid #E8E2D5',
                letterSpacing: '0.08em',
                fontSize: '11px',
              }}
              className="px-4 py-2 uppercase font-sans"
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/collections?category=${cat}`}
                style={{
                  background: category === cat ? '#1A1A1A' : 'transparent',
                  color: category === cat ? '#FAF7F2' : '#9C9080',
                  border: '1px solid #E8E2D5',
                  letterSpacing: '0.08em',
                  fontSize: '11px',
                }}
                className="px-4 py-2 uppercase font-sans"
              >
                {cat}
              </Link>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ fontFamily: 'var(--font-cormorant)', color: '#9C9080', fontSize: '24px' }}>
                No pieces found in this category yet.
              </p>
              <Link href="/contact" style={{ color: '#B8935A' }} className="text-sm font-sans underline mt-4 inline-block">
                Inquire about a custom piece
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
              {products.map((product) => {
                const img = product.images[0]?.url || `https://placehold.co/400x500/F2EDE4/9C9080?text=${encodeURIComponent(product.name)}`
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group">
                    <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#F2EDE4' }}>
                      <Image src={img} alt={product.images[0]?.alt || product.name} fill className="object-cover" style={{ transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100" style={{ background: 'rgba(26,26,26,0.15)', transition: 'opacity 0.3s ease' }} />
                    </div>
                    <div className="mt-3">
                      <p style={{ color: '#B8935A', fontSize: '10px', letterSpacing: '0.1em' }} className="uppercase font-sans">{product.category}</p>
                      <h3 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-lg font-light mt-1">{product.name}</h3>
                      <p style={{ color: '#9C9080' }} className="text-sm font-sans mt-1">
                        {product.showPrice && product.price ? `$${product.price.toLocaleString()}` : 'Price on request'}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

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
  const collection = await prisma.collection.findUnique({ where: { slug } })
  if (!collection) return { title: 'Collection Not Found' }
  return {
    title: collection.name,
    description: collection.description || `Explore the ${collection.name} collection from Tosco International.`,
  }
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params

  const collection = await prisma.collection.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { inStock: true },
        include: { images: { where: { isPrimary: true }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!collection) notFound()

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Collection hero */}
        <section className="relative" style={{ minHeight: '50vh', background: '#1A1A1A' }}>
          {collection.heroImage ? (
            <Image src={collection.heroImage} alt={collection.heroImageAlt || collection.name} fill className="object-cover opacity-60" />
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)' }} className="absolute inset-0" />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p style={{ color: '#B8935A', letterSpacing: '0.15em', fontSize: '11px' }} className="uppercase font-sans mb-4">Collection</p>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#FAF7F2', letterSpacing: '-0.02em' }} className="text-5xl md:text-7xl font-light">
              {collection.name}
            </h1>
            {collection.description && (
              <p style={{ color: '#E8E2D5' }} className="mt-4 max-w-xl font-sans text-base leading-relaxed">{collection.description}</p>
            )}
          </div>
        </section>

        {/* Products grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <p style={{ color: '#9C9080' }} className="font-sans text-sm mb-8">{collection.products.length} {collection.products.length === 1 ? 'piece' : 'pieces'}</p>

          {collection.products.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ fontFamily: 'var(--font-cormorant)', color: '#9C9080', fontSize: '24px' }}>
                New pieces arriving soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
              {collection.products.map((product) => {
                const img = product.images[0]?.url || `https://placehold.co/400x500/F2EDE4/9C9080?text=${encodeURIComponent(product.name)}`
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group">
                    <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#F2EDE4' }}>
                      <Image src={img} alt={product.images[0]?.alt || product.name} fill className="object-cover" style={{ transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100" style={{ background: 'rgba(26,26,26,0.12)', transition: 'opacity 0.3s ease' }} />
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

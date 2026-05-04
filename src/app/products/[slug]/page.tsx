'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'

type ProductImage = { id: string; url: string; thumbUrl?: string; alt?: string; order: number; isPrimary: boolean }
type Product = {
  id: string; name: string; slug: string; category: string; description?: string
  price?: number; showPrice: boolean; specs?: string; inStock: boolean; images: ProductImage[]
  collection?: { name: string; slug: string }
}

function InquiryModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productId: product.id, source: 'product' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,26,26,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-sm p-8" style={{ background: '#FAF7F2' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-2xl font-light">Inquire About This Piece</h2>
            <p style={{ color: '#9C9080' }} className="text-sm font-sans mt-1">{product.name}</p>
          </div>
          <button onClick={onClose} style={{ color: '#9C9080' }} className="text-2xl leading-none">&times;</button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <p style={{ fontFamily: 'var(--font-cormorant)', color: '#B8935A' }} className="text-2xl font-light">Thank you</p>
            <p style={{ color: '#9C9080' }} className="font-sans text-sm mt-2">We will be in touch within one business day.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {['name', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label style={{ color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em' }} className="uppercase font-sans block mb-1">
                  {field}{field !== 'phone' ? ' *' : ''}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  required={field !== 'phone'}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  style={{ border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A' }}
                  className="w-full px-3 py-2 font-sans text-sm focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label style={{ color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em' }} className="uppercase font-sans block mb-1">Message *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A' }}
                className="w-full px-3 py-2 font-sans text-sm focus:outline-none resize-none"
                placeholder="I'm interested in this piece and would like to know more..."
              />
            </div>
            {status === 'error' && <p className="text-red-600 text-sm font-sans">Something went wrong. Please try again.</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ background: '#B8935A', color: '#FAF7F2', letterSpacing: '0.1em' }}
              className="w-full py-3 uppercase font-sans text-xs disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showInquiry, setShowInquiry] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => { setProduct(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF7F2' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', color: '#9C9080' }} className="text-2xl font-light animate-pulse">Loading…</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#FAF7F2' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-4xl font-light">Piece Not Found</p>
          <Link href="/collections" style={{ color: '#B8935A' }} className="mt-4 font-sans text-sm underline">Browse all collections</Link>
        </div>
        <Footer />
      </>
    )
  }

  const images = product.images.length > 0
    ? [...product.images].sort((a, b) => a.order - b.order)
    : [{ id: '0', url: `https://placehold.co/800x1000/F2EDE4/9C9080?text=${encodeURIComponent(product.name)}`, alt: product.name, order: 0, isPrimary: true }]

  const specs = product.specs ? (() => { try { return JSON.parse(product.specs!) } catch { return {} } })() : {}

  return (
    <>
      <Header />
      {showInquiry && <InquiryModal product={product} onClose={() => setShowInquiry(false)} />}

      <main className="pt-20" style={{ background: '#FAF7F2' }}>
        {/* Breadcrumb */}
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <nav style={{ color: '#9C9080', fontSize: '12px' }} className="font-sans flex gap-2 items-center">
            <Link href="/" style={{ color: '#9C9080' }}>Home</Link>
            <span>/</span>
            <Link href="/collections" style={{ color: '#9C9080' }}>Collections</Link>
            <span>/</span>
            <span style={{ color: '#B8935A' }}>{product.name}</span>
          </nav>
        </div>

        {/* Product detail */}
        <section className="px-6 pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image gallery */}
            <div>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', background: '#F2EDE4' }}>
                <Image src={images[selectedImage]?.url || ''} alt={images[selectedImage]?.alt || product.name} fill className="object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {images.map((img, i) => (
                    <button key={img.id} onClick={() => setSelectedImage(i)} className="relative flex-shrink-0"
                      style={{ width: '72px', height: '90px', border: i === selectedImage ? '1px solid #B8935A' : '1px solid #E8E2D5' }}>
                      <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="flex flex-col">
              <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.12em' }} className="uppercase font-sans">{product.category}</p>
              <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', letterSpacing: '-0.02em' }} className="text-4xl font-light mt-2">{product.name}</h1>

              {product.showPrice && product.price ? (
                <p style={{ color: '#1A1A1A' }} className="text-2xl font-sans mt-3">${product.price.toLocaleString()}</p>
              ) : (
                <p style={{ color: '#9C9080' }} className="font-sans text-sm mt-3">Price available upon inquiry</p>
              )}

              {/* Shipping */}
              <div style={{ background: '#F2EDE4', borderLeft: '2px solid #B8935A' }} className="px-4 py-3 mt-6">
                <p style={{ color: '#1A1A1A', fontSize: '12px' }} className="font-sans">
                  Complimentary worldwide shipping · Arrives in 5–7 business days · Insured & tracked
                </p>
              </div>

              {/* Specs */}
              {Object.keys(specs).length > 0 && (
                <div className="mt-6" style={{ borderTop: '1px solid #E8E2D5', paddingTop: '20px' }}>
                  <p style={{ color: '#1A1A1A', fontSize: '11px', letterSpacing: '0.1em' }} className="uppercase font-sans mb-3">Specifications</p>
                  <dl className="space-y-2">
                    {Object.entries(specs).map(([k, v]) => v ? (
                      <div key={k} className="flex gap-4">
                        <dt style={{ color: '#9C9080', fontSize: '12px', width: '90px', flexShrink: 0 }} className="font-sans capitalize">{k}</dt>
                        <dd style={{ color: '#1A1A1A', fontSize: '13px' }} className="font-sans">{v as string}</dd>
                      </div>
                    ) : null)}
                  </dl>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mt-6" style={{ borderTop: '1px solid #E8E2D5', paddingTop: '20px' }}>
                  <p style={{ color: '#1A1A1A', fontSize: '11px', letterSpacing: '0.1em' }} className="uppercase font-sans mb-3">About This Piece</p>
                  <div style={{ color: '#2D2D2D', lineHeight: '1.8' }} className="font-sans text-sm prose-luxury" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => setShowInquiry(true)}
                  style={{ background: '#B8935A', color: '#FAF7F2', letterSpacing: '0.1em' }}
                  className="w-full py-4 uppercase font-sans text-xs"
                >
                  Inquire About This Piece
                </button>
                <Link href="/contact" style={{ border: '1px solid #1A1A1A', color: '#1A1A1A', letterSpacing: '0.08em' }} className="w-full py-3 uppercase font-sans text-xs flex items-center justify-center">
                  Book a Private Consultation
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  ['Lifetime Warranty', 'Every piece, forever protected'],
                  ['GIA-Certified', 'Authenticity in every facet'],
                  ['Free Shipping', 'Worldwide, fully insured'],
                  ['30-Day Returns', 'Wear it with confidence'],
                ].map(([title, sub]) => (
                  <div key={title} style={{ border: '1px solid #E8E2D5' }} className="p-3">
                    <p style={{ color: '#1A1A1A', fontSize: '11px', letterSpacing: '0.06em' }} className="uppercase font-sans">{title}</p>
                    <p style={{ color: '#9C9080', fontSize: '11px' }} className="font-sans mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

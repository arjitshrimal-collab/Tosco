'use client'

import { useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface ProductImage {
  url: string
  isPrimary: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  category: string
  price?: number | null
  showPrice: boolean
  images: ProductImage[]
}

interface BestsellersGridProps {
  products: Product[]
  onInquire?: (slug: string) => void
}

const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Lumière Diamond Solitaire',
    slug: 'lumiere-diamond-solitaire',
    category: 'Rings',
    price: null,
    showPrice: false,
    images: [],
  },
  {
    id: '2',
    name: 'Emerald Cascade Necklace',
    slug: 'emerald-cascade-necklace',
    category: 'Necklaces',
    price: null,
    showPrice: false,
    images: [],
  },
  {
    id: '3',
    name: 'Pavé Eternity Band',
    slug: 'pave-eternity-band',
    category: 'Bands',
    price: null,
    showPrice: false,
    images: [],
  },
  {
    id: '4',
    name: 'Sapphire Drop Earrings',
    slug: 'sapphire-drop-earrings',
    category: 'Earrings',
    price: null,
    showPrice: false,
    images: [],
  },
  {
    id: '5',
    name: 'Vintage Rose Brooch',
    slug: 'vintage-rose-brooch',
    category: 'Brooches',
    price: null,
    showPrice: false,
    images: [],
  },
  {
    id: '6',
    name: 'Celestial Pearl Bracelet',
    slug: 'celestial-pearl-bracelet',
    category: 'Bracelets',
    price: null,
    showPrice: false,
    images: [],
  },
  {
    id: '7',
    name: 'Heritage Signet Ring',
    slug: 'heritage-signet-ring',
    category: 'Rings',
    price: null,
    showPrice: false,
    images: [],
  },
  {
    id: '8',
    name: 'Diamond Tennis Bracelet',
    slug: 'diamond-tennis-bracelet',
    category: 'Bracelets',
    price: null,
    showPrice: false,
    images: [],
  },
]

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: easeOut,
    },
  },
}

function WishlistHeart({ productId }: { productId: string }) {
  const [liked, setLiked] = useState(false)
  return (
    <button
      type="button"
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={(e) => {
        e.preventDefault()
        setLiked((v) => !v)
      }}
      className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full"
      style={{
        background: 'rgba(250,247,242,0.9)',
        transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.2s',
        boxShadow: '0 2px 8px rgba(26,26,26,0.12)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
      }}
    >
      <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
        <path
          d="M7 12C7 12 1 8 1 4.5C1 2.567 2.567 1 4.5 1C5.552 1 6.5 1.5 7 2.25C7.5 1.5 8.448 1 9.5 1C11.433 1 13 2.567 13 4.5C13 8 7 12 7 12Z"
          stroke={liked ? '#B8935A' : '#9C9080'}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={liked ? '#B8935A' : 'none'}
          style={{ transition: 'fill 0.2s, stroke 0.2s' }}
        />
      </svg>
    </button>
  )
}

function ProductCard({
  product,
  onInquire,
}: {
  product: Product
  onInquire?: (slug: string) => void
}) {
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0]
  const imageSrc =
    primaryImage?.url ||
    `https://placehold.co/400x500/F2EDE4/1A1A1A?text=${encodeURIComponent(product.name)}`

  const formattedPrice =
    product.showPrice && product.price
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)
      : 'Price on request'

  return (
    <div
      className="group relative flex flex-col"
      style={{
        boxShadow: 'none',
        transition: 'box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 2px 8px rgba(26,26,26,0.06), 0 8px 32px rgba(184,147,90,0.08)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden image-luxury" style={{ aspectRatio: '4/5' }}>
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(26,26,26,0.25) 0%, transparent 50%)',
          }}
        />
      </Link>

      {/* Wishlist */}
      <WishlistHeart productId={product.id} />

      {/* Info */}
      <div className="mt-4 flex flex-col gap-1 px-1">
        <p
          className="text-xs uppercase tracking-luxury"
          style={{ color: '#B8935A', letterSpacing: '0.12em' }}
        >
          {product.category}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="tosco-product-name-link font-display text-lg font-light"
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm" style={{ color: '#9C9080' }}>
            {formattedPrice}
          </span>
          <button
            type="button"
            onClick={() => onInquire?.(product.slug)}
            className="text-xs uppercase tracking-luxury"
            style={{
              color: '#1A1A1A',
              letterSpacing: '0.12em',
              textDecoration: 'underline',
              textDecorationColor: 'transparent',
              transition: 'text-decoration-color 0.2s, color 0.2s',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#B8935A'
              ;(e.currentTarget as HTMLElement).style.textDecorationColor = '#B8935A'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#1A1A1A'
              ;(e.currentTarget as HTMLElement).style.textDecorationColor = 'transparent'
            }}
          >
            Inquire
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BestsellersGrid({ products, onInquire }: BestsellersGridProps) {
  const displayProducts = products.length > 0 ? products : PLACEHOLDER_PRODUCTS
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24 px-4" style={{ background: '#FAF7F2' }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-xs uppercase tracking-luxury"
            style={{ color: '#B8935A', letterSpacing: '0.12em' }}
          >
            Most Beloved
          </p>
          <h2
            className="font-display text-4xl font-light italic tracking-display md:text-5xl"
            style={{ color: '#1A1A1A', letterSpacing: '-0.03em' }}
          >
            Treasured Pieces
          </h2>
          <div
            className="mx-auto mt-6 h-px w-16"
            style={{ background: 'rgba(184,147,90,0.4)' }}
          />
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
        >
          {displayProducts.slice(0, 8).map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} onInquire={onInquire} />
            </motion.div>
          ))}
        </motion.div>

        {/* View all */}
        <div className="mt-16 text-center">
          <Link href="/products" className="tosco-view-all-btn">
            View All Pieces
          </Link>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface Collection {
  id: string
  name: string
  slug: string
  heroImage?: string | null
  description?: string | null
}

interface CollectionsStripProps {
  collections: Collection[]
}

const PLACEHOLDER_COLLECTIONS: Collection[] = [
  { id: '1', name: 'Bridal', slug: 'bridal', heroImage: null },
  { id: '2', name: 'Diamonds', slug: 'diamonds', heroImage: null },
  { id: '3', name: 'Emeralds', slug: 'emeralds', heroImage: null },
  { id: '4', name: 'Heritage', slug: 'heritage', heroImage: null },
]

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: easeOut,
    },
  },
}

function CollectionCard({ collection }: { collection: Collection }) {
  const imageSrc =
    collection.heroImage ||
    `https://placehold.co/600x800/1A1A1A/B8935A?text=${encodeURIComponent(collection.name)}`

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative block overflow-hidden"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Image */}
      <div className="absolute inset-0 image-luxury">
        <Image
          src={imageSrc}
          alt={collection.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 25vw"
          style={{
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </div>

      {/* Dark overlay always */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0.2) 50%, transparent 100%)',
          transition: 'background 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: 'rgba(184,147,90,0.12)',
          transition: 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
        {/* Collection name — slides up on hover */}
        <h3
          className="font-display text-2xl font-light italic text-center"
          style={{
            color: '#FAF7F2',
            transform: 'translateY(0)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {collection.name}
        </h3>

        {/* Explore label — appears on hover */}
        <div
          className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100"
          style={{
            transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <span
            className="text-xs uppercase tracking-luxury"
            style={{ color: '#B8935A', letterSpacing: '0.12em' }}
          >
            Explore
          </span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 4h10M7 1l4 3-4 3"
              stroke="#B8935A"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Gold line accent */}
        <div
          className="mt-4 h-px w-8 opacity-0 group-hover:opacity-100"
          style={{
            background: '#B8935A',
            transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </div>
    </Link>
  )
}

export default function CollectionsStrip({ collections }: CollectionsStripProps) {
  const displayCollections =
    collections.length > 0 ? collections : PLACEHOLDER_COLLECTIONS

  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="py-24 px-4"
      style={{ background: '#FAF7F2' }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-xs uppercase tracking-luxury"
            style={{ color: '#B8935A', letterSpacing: '0.12em' }}
          >
            Curated for you
          </p>
          <h2
            className="font-display text-4xl font-light italic tracking-display md:text-5xl"
            style={{ color: '#1A1A1A', letterSpacing: '-0.03em' }}
          >
            Our Collections
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
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {displayCollections.slice(0, 4).map((collection) => (
            <motion.div key={collection.id} variants={itemVariants}>
              <CollectionCard collection={collection} />
            </motion.div>
          ))}
        </motion.div>

        {/* View all */}
        <div className="mt-12 text-center">
          <Link href="/collections" className="tosco-collections-view-link">
            View All Collections
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path
                d="M1 5h14M11 1l4 4-4 4"
                stroke="#B8935A"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

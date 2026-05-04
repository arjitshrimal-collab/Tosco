'use client'

import { useEffect, useRef } from 'react'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'

interface HeroSectionProps {
  heroImage?: string | null
  heroHeading?: string
  heroSubheading?: string
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.85,
      ease: easeOut,
    },
  }),
}

export default function HeroSection({
  heroImage,
  heroHeading = 'Where Every Piece Tells a Story',
  heroSubheading = "Handcrafted fine jewelry for life's most precious moments",
}: HeroSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let frame: number
    const animate = () => {
      const t = Date.now() / 1000
      el.style.opacity = String(0.5 + 0.5 * Math.sin(t * 2))
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden grain-overlay"
      style={{
        background: heroImage
          ? `url(${heroImage}) center/cover no-repeat`
          : '#1A1A1A',
      }}
    >
      {/* Multi-layer gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: heroImage
            ? 'linear-gradient(to bottom, rgba(26,26,26,0.55) 0%, rgba(26,26,26,0.3) 40%, rgba(26,26,26,0.7) 100%)'
            : [
                'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(184,147,90,0.18) 0%, transparent 60%)',
                'radial-gradient(ellipse 60% 80% at 80% 80%, rgba(184,147,90,0.10) 0%, transparent 60%)',
                'radial-gradient(ellipse 100% 100% at 50% 50%, #1A1A1A 0%, #0d0d0d 100%)',
              ].join(', '),
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="tracking-luxury mb-8 text-xs font-medium uppercase"
          style={{ color: '#B8935A', letterSpacing: '0.12em' }}
        >
          Est. 2004 · New York
        </motion.p>

        {/* Divider line */}
        <motion.div
          custom={0.5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8 h-px w-16"
          style={{ background: 'rgba(184,147,90,0.5)' }}
        />

        {/* Main heading */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display tracking-display mb-6 font-light italic"
          style={{
            color: '#FAF7F2',
            fontSize: 'clamp(2.75rem, 7vw, 5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          {heroHeading}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-12 max-w-lg font-sans text-lg leading-relaxed"
          style={{ color: '#9C9080' }}
        >
          {heroSubheading}
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/collections" className="tosco-hero-primary-btn">
            Explore the Collection
          </Link>

          <Link href="/contact" className="tosco-hero-secondary-btn">
            Book a Private Consultation
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span
          className="text-xs uppercase tracking-luxury"
          style={{ color: 'rgba(156,144,128,0.7)', letterSpacing: '0.12em', fontSize: '10px' }}
        >
          Scroll
        </span>
        <div ref={scrollRef}>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 4L8 20M8 20L2 14M8 20L14 14"
              stroke="#B8935A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

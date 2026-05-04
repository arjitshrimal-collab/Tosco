'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  id: string
  author: string
  location?: string | null
  content: string
  rating: number
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Priya Mehta',
    location: 'New York, NY',
    content:
      'Tosco created the most breathtaking engagement ring for us. The craftsmanship is extraordinary — every time I look at it, I see something new. Asit and his team made the entire process feel personal and deeply meaningful.',
    rating: 5,
  },
  {
    id: '2',
    author: 'Catherine Harlow',
    location: 'London, UK',
    content:
      'I have worn fine jewelry from houses across Europe and America, and I can honestly say that Tosco stands apart. The emerald necklace I commissioned is a work of art. Their dedication to precision is unmatched.',
    rating: 5,
  },
  {
    id: '3',
    author: 'Ananya Krishnamurthy',
    location: 'San Francisco, CA',
    content:
      'What sets Tosco apart is the relationship they build with you. Aditi remembered every detail of what I mentioned on our first call, months later. The final piece was beyond anything I could have imagined.',
    rating: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={i < count ? '#B8935A' : 'none'}
          aria-hidden="true"
        >
          <path
            d="M6 1l1.3 2.8L10 4.3l-2 2 .5 2.8L6 7.8l-2.5 1.3.5-2.8-2-2 2.7-.5L6 1Z"
            stroke="#B8935A"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % displayTestimonials.length)
  }, [displayTestimonials.length])

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(next, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, next])

  return (
    <section
      className="py-24 px-4"
      style={{ background: '#1A1A1A' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-xs uppercase tracking-luxury"
            style={{ color: '#B8935A', letterSpacing: '0.12em' }}
          >
            Client Stories
          </p>
          <h2
            className="font-display text-4xl font-light italic tracking-display md:text-5xl"
            style={{ color: '#FAF7F2', letterSpacing: '-0.03em' }}
          >
            Words from Our Circle
          </h2>
          <div
            className="mx-auto mt-6 h-px w-16"
            style={{ background: 'rgba(184,147,90,0.4)' }}
          />
        </div>

        {/* Carousel */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center text-center"
            >
              {/* Large quotation mark */}
              <div
                className="font-display mb-6 text-7xl font-light leading-none"
                style={{ color: 'rgba(184,147,90,0.4)', lineHeight: 0.8 }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Star rating */}
              <div className="mb-6">
                <StarRating count={displayTestimonials[current].rating} />
              </div>

              {/* Content */}
              <blockquote
                className="font-display max-w-2xl text-xl font-light italic leading-relaxed md:text-2xl"
                style={{ color: '#FAF7F2', lineHeight: 1.75 }}
              >
                {displayTestimonials[current].content}
              </blockquote>

              {/* Author */}
              <div className="mt-8">
                <p
                  className="text-sm font-medium uppercase tracking-luxury"
                  style={{ color: '#FAF7F2', letterSpacing: '0.12em' }}
                >
                  {displayTestimonials[current].author}
                </p>
                {displayTestimonials[current].location && (
                  <p
                    className="mt-1 text-xs uppercase tracking-luxury"
                    style={{ color: '#9C9080', letterSpacing: '0.12em' }}
                  >
                    {displayTestimonials[current].location}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot navigation */}
        <div className="mt-12 flex items-center justify-center gap-3" role="tablist">
          {displayTestimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setCurrent(i)}
              className="block rounded-full"
              style={{
                width: i === current ? '24px' : '6px',
                height: '6px',
                background: i === current ? '#B8935A' : 'rgba(156,144,128,0.4)',
                transition: 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.3s',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'

export default function LegacySection() {
  return (
    <section
      className="py-24 px-4"
      style={{ background: '#F2EDE4' }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          {/* Left: Portrait image */}
          <div className="relative">
            <div
              className="image-luxury relative overflow-hidden"
              style={{ aspectRatio: '6/7' }}
            >
              <Image
                src="https://placehold.co/600x700/1A1A1A/B8935A?text=Tosco+Atelier"
                alt="Tosco International atelier"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Color treatment overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(26,26,26,0.4) 0%, transparent 60%)',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
            {/* Decorative corner accent */}
            <div
              className="absolute -bottom-4 -right-4 h-24 w-24 border-b border-r"
              style={{ borderColor: 'rgba(184,147,90,0.3)' }}
              aria-hidden="true"
            />
            <div
              className="absolute -top-4 -left-4 h-24 w-24 border-t border-l"
              style={{ borderColor: 'rgba(184,147,90,0.3)' }}
              aria-hidden="true"
            />
          </div>

          {/* Right: Text */}
          <div className="relative">
            {/* Gold accent line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, #B8935A, transparent)' }}
              aria-hidden="true"
            />

            <div className="pl-8">
              {/* Eyebrow */}
              <p
                className="mb-4 text-xs uppercase tracking-luxury"
                style={{ color: '#B8935A', letterSpacing: '0.12em' }}
              >
                The Shrimal Legacy
              </p>

              {/* Heading */}
              <h2
                className="font-display mb-8 text-3xl font-light italic tracking-display md:text-4xl lg:text-5xl"
                style={{ color: '#1A1A1A', letterSpacing: '-0.03em', lineHeight: 1.15 }}
              >
                A Story Rooted in Craft and Care
              </h2>

              {/* Divider */}
              <div
                className="mb-8 h-px w-12"
                style={{ background: 'rgba(184,147,90,0.5)' }}
              />

              {/* Body copy */}
              <div className="prose-luxury space-y-6">
                <p
                  className="text-base leading-relaxed"
                  style={{ color: '#2D2D2D', lineHeight: 1.8 }}
                >
                  Tosco International Inc. was born from a shared dream — that of Asit and Aditi
                  Shrimal, who believed that the finest jewelry is not merely worn, but felt.
                  Founded on the principles of uncompromising craftsmanship and deeply personal
                  service, Tosco has become a destination for those who seek pieces that carry
                  meaning.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: '#2D2D2D', lineHeight: 1.8 }}
                >
                  Every collection we present reflects our atelier&apos;s philosophy: that beauty
                  is precise, that heritage matters, and that the relationship between a jeweler and
                  their client is one of lifelong trust.
                </p>
              </div>

              {/* Signature / link */}
              <div className="mt-10">
                <a
                  href="/about"
                  className="tosco-story-link text-sm uppercase"
                  style={{ color: '#1A1A1A', letterSpacing: '0.12em' }}
                >
                  Our Story
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path
                      d="M1 5h14M11 1l4 4-4 4"
                      stroke="#1A1A1A"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

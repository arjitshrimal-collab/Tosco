import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The story of Tosco International Inc. — founded by Asit and Aditi Shrimal on a shared belief in craftsmanship, heritage, and the intimacy of fine jewelry.',
}

const VALUES = [
  { name: 'Authenticity', text: 'Every stone is certified, every claim verifiable. We deal only in truth.' },
  { name: 'Precision', text: 'Tolerances measured in microns. Standards held without exception.' },
  { name: 'Longevity', text: 'Pieces built to outlast generations, not trends.' },
  { name: 'Intimacy', text: 'We know our clients by name. The relationship endures beyond the purchase.' },
  { name: 'Sustainability', text: 'Responsibly sourced materials, ethical supply chains, minimal waste.' },
  { name: 'Excellence', text: 'Not a goal but a baseline — the minimum standard we set for ourselves.' },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-32 text-center" style={{ background: 'linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 100%)' }}>
          <div className="relative z-10 max-w-3xl mx-auto px-6">
            <p style={{ color: '#B8935A', letterSpacing: '0.15em', fontSize: '11px' }} className="uppercase font-sans mb-4">Since 2004</p>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#FAF7F2', letterSpacing: '-0.03em', lineHeight: 1.1 }} className="text-5xl md:text-7xl font-light italic">
              The Art of Fine Jewelry
            </h1>
            <p style={{ color: '#9C9080' }} className="mt-6 font-sans text-base leading-relaxed">
              Where craft meets intention, and every piece carries a story worth telling.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.12em' }} className="uppercase font-sans mb-4">Our Story</p>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', lineHeight: 1.15 }} className="text-4xl font-light mb-6">
                A Story Rooted in Craft and Care
              </h2>
              <div style={{ borderLeft: '2px solid #B8935A', paddingLeft: '24px' }}>
                <p style={{ color: '#2D2D2D', lineHeight: '1.85' }} className="font-sans text-sm mb-4">
                  Tosco International Inc. was born from a shared dream — that of Asit and Aditi Shrimal, who believed that the finest jewelry is not merely worn, but felt. Founded on the principles of uncompromising craftsmanship and deeply personal service, Tosco has become a destination for those who seek pieces that carry meaning.
                </p>
                <p style={{ color: '#2D2D2D', lineHeight: '1.85' }} className="font-sans text-sm">
                  Every collection we present reflects our atelier's philosophy: that beauty is precise, that heritage matters, and that the relationship between a jeweler and their client is one of lifelong trust. From our very first commission to the thousandth, we approach each piece with the same quiet devotion.
                </p>
              </div>
            </div>
            <div className="relative" style={{ aspectRatio: '4/5' }}>
              <Image
                src="https://placehold.co/600x750/F2EDE4/9C9080?text=The+Atelier"
                alt="The Tosco Atelier"
                fill
                className="object-cover"
              />
              <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(184,147,90,0.1) 0%, transparent 60%)' }} />
            </div>
          </div>
        </section>

        {/* Philosophy pillars */}
        <section className="py-20 px-6" style={{ background: '#F2EDE4' }}>
          <div className="max-w-5xl mx-auto text-center mb-14">
            <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.12em' }} className="uppercase font-sans mb-3">Our Philosophy</p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-4xl font-light">Three Pillars</h2>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Craftsmanship', icon: '◈', text: 'Every piece passes through the hands of our master craftspeople. No shortcuts, no compromises — only meticulous attention to the material and to the vision.' },
              { title: 'Heritage', icon: '◇', text: 'We draw from centuries of jewelry tradition, studying the great houses, the ancient techniques, and the stories embedded in stone and metal.' },
              { title: 'Trust', icon: '○', text: 'Our clients come back not just for jewelry, but for counsel, for celebration, for the relationship that grows over years of shared milestones.' },
            ].map(({ title, icon, text }) => (
              <div key={title} className="text-center p-8" style={{ background: '#FAF7F2', boxShadow: '0 2px 8px rgba(26,26,26,0.06)' }}>
                <div style={{ color: '#B8935A', fontSize: '28px' }} className="mb-4">{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-2xl font-light mb-3">{title}</h3>
                <p style={{ color: '#9C9080', lineHeight: '1.75' }} className="font-sans text-sm">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Atelier — dark section */}
        <section className="py-24 px-6 text-center" style={{ background: '#1A1A1A' }}>
          <div className="max-w-3xl mx-auto">
            <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.12em' }} className="uppercase font-sans mb-4">The Atelier</p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#FAF7F2', lineHeight: 1.15 }} className="text-4xl font-light italic mb-6">
              Where Every Piece Begins
            </h2>
            <p style={{ color: '#9C9080', lineHeight: '1.85' }} className="font-sans text-sm">
              Our workshop occupies a quiet floor in the heart of New York's Jewelry District. Here, light falls across benches worn smooth by decades of use. Craftspeople who have spent their careers perfecting a single skill — stone setting, granulation, hand engraving — work beside younger artisans learning the same disciplines. This is how knowledge survives. This is how Tosco pieces are made.
            </p>
          </div>
        </section>

        {/* Founders */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.12em' }} className="uppercase font-sans mb-3">The Founders</p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-4xl font-light">Meet the Shrimals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { name: 'Asit Shrimal', title: 'Co-Founder & Creative Director', bio: 'With over two decades in fine jewelry, Asit oversees every design that leaves the Tosco atelier. His eye for proportion and his insistence on material integrity have defined the house aesthetic — understated, precise, and deeply considered.', img: 'https://placehold.co/400x500/F2EDE4/9C9080?text=Asit+Shrimal' },
              { name: 'Aditi Shrimal', title: 'Co-Founder & Client Director', bio: "Aditi brings a rare combination of warmth and rigor to her work with clients. She believes that fine jewelry should mark the moments that matter — and she ensures that every client's experience at Tosco is as memorable as the piece they receive.", img: 'https://placehold.co/400x500/F2EDE4/9C9080?text=Aditi+Shrimal' },
            ].map(({ name, title, bio, img }) => (
              <div key={name} className="flex flex-col sm:flex-row gap-6">
                <div className="relative flex-shrink-0" style={{ width: '160px', height: '200px' }}>
                  <Image src={img} alt={name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-2xl font-light">{name}</h3>
                  <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.08em' }} className="uppercase font-sans mt-1">{title}</p>
                  <p style={{ color: '#9C9080', lineHeight: '1.75' }} className="font-sans text-sm mt-3">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6" style={{ background: '#F2EDE4' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.12em' }} className="uppercase font-sans mb-3">What We Stand For</p>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-4xl font-light">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map(({ name, text }) => (
                <div key={name} className="p-6" style={{ background: '#FAF7F2', borderTop: '2px solid #B8935A' }}>
                  <h4 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-xl font-light mb-2">{name}</h4>
                  <p style={{ color: '#9C9080', lineHeight: '1.7' }} className="font-sans text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

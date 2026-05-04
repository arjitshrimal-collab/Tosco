import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Shipping & Returns' }

export default function ShippingReturnsPage() {
  return (
    <>
      <Header />
      <main className="pt-20" style={{ background: '#FAF7F2' }}>
        <section className="py-16 text-center" style={{ borderBottom: '1px solid #E8E2D5' }}>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-5xl font-light">Shipping & Returns</h1>
          <p style={{ color: '#9C9080' }} className="mt-3 font-sans text-sm max-w-md mx-auto leading-relaxed">
            Every Tosco piece is shipped with the same care that went into making it.
          </p>
        </section>
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-12" style={{ color: '#2D2D2D' }}>
          <section>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-3xl font-light mb-6">Shipping</h2>
            <div className="space-y-5 font-sans text-sm" style={{ lineHeight: '1.85' }}>
              <p><strong style={{ color: '#1A1A1A', fontWeight: 500 }}>Complimentary worldwide shipping</strong> is included on all orders. We do not believe that delivering beauty should come with a logistical surcharge.</p>
              <p>All pieces ship fully insured via FedEx International Priority or equivalent courier. Domestic (US) orders typically arrive within <strong style={{ color: '#1A1A1A', fontWeight: 500 }}>3–5 business days</strong>. International orders arrive within <strong style={{ color: '#1A1A1A', fontWeight: 500 }}>5–10 business days</strong>, depending on destination and customs clearance.</p>
              <p>Each piece is packaged in our signature Tosco presentation box, wrapped in tissue, and placed inside a protective shipping carton. A certificate of authenticity and care guide are included with every order.</p>
              <p>Tracking information is emailed at the time of dispatch. For high-value pieces, a signature will be required upon delivery.</p>
              <p>Custom and commission pieces require additional production time — your Tosco advisor will provide an estimated delivery date at the time of order confirmation.</p>
            </div>
          </section>
          <div style={{ height: '1px', background: '#E8E2D5' }} />
          <section>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-3xl font-light mb-6">Returns</h2>
            <div className="space-y-5 font-sans text-sm" style={{ lineHeight: '1.85' }}>
              <p>We offer a <strong style={{ color: '#1A1A1A', fontWeight: 500 }}>30-day return policy</strong> on all stock pieces purchased at list price. If you are not completely satisfied, we will arrange a full refund or exchange.</p>
              <p>To initiate a return, please contact us at <a href="mailto:returns@toscointernational.com" style={{ color: '#B8935A' }}>returns@toscointernational.com</a> within 30 days of receipt. We will provide a prepaid, insured return label. Items must be returned in their original, unworn condition in the original packaging.</p>
              <p>The following are <strong style={{ color: '#1A1A1A', fontWeight: 500 }}>not eligible for return</strong>: custom-commissioned pieces, engraved items, and pieces that have been altered after purchase.</p>
              <p>Refunds are processed to the original payment method within 7–10 business days of receiving the returned item and confirming its condition.</p>
            </div>
          </section>
          <div style={{ height: '1px', background: '#E8E2D5' }} />
          <section>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-3xl font-light mb-6">Lifetime Warranty</h2>
            <div className="space-y-5 font-sans text-sm" style={{ lineHeight: '1.85' }}>
              <p>Every Tosco piece is backed by our <strong style={{ color: '#1A1A1A', fontWeight: 500 }}>Lifetime Warranty</strong>, covering manufacturing defects in materials and workmanship. This warranty reflects our belief that a Tosco piece should last a lifetime — and beyond.</p>
              <p>The warranty covers: prong re-tipping, clasp repair, and structural repairs due to normal wear. It does not cover loss, theft, accidental damage, or damage resulting from neglect or improper care.</p>
              <p>For warranty service, please contact your Tosco advisor or email <a href="mailto:care@toscointernational.com" style={{ color: '#B8935A' }}>care@toscointernational.com</a>. We will arrange for complimentary shipping and assessment.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

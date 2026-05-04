import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-20" style={{ background: '#FAF7F2' }}>
        <section className="py-16 text-center" style={{ borderBottom: '1px solid #E8E2D5' }}>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-5xl font-light">Terms of Service</h1>
          <p style={{ color: '#9C9080' }} className="mt-3 font-sans text-sm">Last updated: January 1, 2024</p>
        </section>
        <div className="max-w-3xl mx-auto px-6 py-16 prose-luxury font-sans text-sm space-y-8" style={{ color: '#2D2D2D', lineHeight: '1.85' }}>
          {[
            { h: 'Acceptance of Terms', p: 'By accessing the Tosco International Inc. website and using our services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.' },
            { h: 'Products and Services', p: 'All products displayed on this website are subject to availability. Descriptions, images, and specifications are provided in good faith and are as accurate as possible. Colors may appear slightly different on screen. We reserve the right to withdraw any product from sale at any time.' },
            { h: 'Pricing', p: 'Where prices are displayed, they are in United States Dollars (USD) and are exclusive of applicable taxes and shipping costs unless stated otherwise. Prices are subject to change without notice. For pieces priced on request, we will provide a formal quotation upon inquiry.' },
            { h: 'Inquiries and Orders', p: 'Submitting an inquiry does not constitute a binding order. Orders are confirmed only upon receipt of a written confirmation from Tosco International Inc. Custom commissions require a signed agreement and deposit before work commences.' },
            { h: 'Intellectual Property', p: 'All content on this website — including photographs, text, design, and the Tosco International name and logo — is the property of Tosco International Inc. and is protected by copyright and trademark law. No content may be reproduced, distributed, or used without prior written permission.' },
            { h: 'Limitation of Liability', p: 'To the fullest extent permitted by law, Tosco International Inc. shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or our services. Our total liability in any matter shall not exceed the amount paid for the relevant product or service.' },
            { h: 'Governing Law', p: 'These terms are governed by the laws of the State of New York, United States. Any disputes shall be subject to the exclusive jurisdiction of the courts of New York County.' },
            { h: 'Contact', p: 'For questions about these Terms, please contact us at legal@toscointernational.com.' },
          ].map(({ h, p }) => (
            <div key={h}>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-2xl font-light mb-3">{h}</h2>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

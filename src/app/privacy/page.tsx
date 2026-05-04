import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-20" style={{ background: '#FAF7F2' }}>
        <section className="py-16 text-center" style={{ borderBottom: '1px solid #E8E2D5' }}>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-5xl font-light">Privacy Policy</h1>
          <p style={{ color: '#9C9080' }} className="mt-3 font-sans text-sm">Last updated: January 1, 2024</p>
        </section>
        <div className="max-w-3xl mx-auto px-6 py-16 prose-luxury font-sans text-sm space-y-8" style={{ color: '#2D2D2D', lineHeight: '1.85' }}>
          {[
            { h: 'Information We Collect', p: 'When you contact us, place an inquiry, or subscribe to our newsletter, we collect your name, email address, and phone number. We may also collect browsing data such as pages visited and time spent, solely to improve your experience on our website. We do not collect financial data directly — all payments are processed through secure third-party processors.' },
            { h: 'How We Use Your Information', p: 'We use your information to respond to inquiries, fulfill orders, send newsletters (if subscribed), and improve our website. We do not sell, rent, or trade your personal information to any third party. Communications from us are limited to matters you have expressed interest in.' },
            { h: 'Data Security', p: 'We take reasonable measures to protect your personal information from unauthorized access or disclosure. Our website uses SSL encryption for all data transmissions. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.' },
            { h: 'Cookies', p: 'Our website uses minimal cookies — strictly those necessary for site functionality and analytics. We do not use advertising or tracking cookies. You may disable cookies in your browser settings without affecting your ability to use our website.' },
            { h: 'Your Rights', p: 'You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, please contact us at privacy@toscointernational.com. We will respond within 30 days.' },
            { h: 'Contact', p: 'If you have any questions about this Privacy Policy, please contact us at: privacy@toscointernational.com · Tosco International Inc., 123 Jewelry District, New York, NY 10036.' },
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

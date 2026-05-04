import Link from 'next/link'

const COLLECTIONS_LINKS = [
  { label: 'Rings', href: '/collections?category=Rings' },
  { label: 'Necklaces', href: '/collections?category=Necklaces' },
  { label: 'Earrings', href: '/collections?category=Earrings' },
  { label: 'Bracelets', href: '/collections?category=Bracelets' },
  { label: 'Bridal', href: '/collections?category=Bridal' },
  { label: 'Custom', href: '/collections?category=Custom' },
]

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Shipping & Returns', href: '/shipping-returns' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A1A', borderTop: '1px solid #2D2D2D' }}>
      <div className="max-w-[1440px] mx-auto px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-start">
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '22px', fontWeight: 600, letterSpacing: '0.15em', color: '#B8935A', lineHeight: 1 }}>
                TOSCO
              </span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '7.5px', letterSpacing: '0.18em', color: '#9C9080', marginTop: '4px', lineHeight: 1 }}>
                INTERNATIONAL
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '15px', fontStyle: 'italic', lineHeight: 1.65, color: '#E8E2D5', maxWidth: '200px' }}>
              Crafted with heritage.<br />Worn with purpose.
            </p>
            <div className="flex items-center gap-4 mt-1">
              {[
                { label: 'Instagram', path: 'M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm3.5-11.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z', isRect: true },
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', isRect: false },
              ].map(({ label, path, isRect }) => (
                <button key={label} aria-label={`Follow us on ${label}`} className="tosco-footer-social" style={{ background: 'none', border: 'none', padding: '2px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {isRect && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
                    <path d={path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="flex flex-col gap-4">
            <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FAF7F2', marginBottom: '4px' }}>
              Collections
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {COLLECTIONS_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="tosco-footer-link" style={{ fontFamily: 'var(--font-inter)', fontSize: '13px' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FAF7F2', marginBottom: '4px' }}>
              Company
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="tosco-footer-link" style={{ fontFamily: 'var(--font-inter)', fontSize: '13px' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FAF7F2', marginBottom: '4px' }}>
              Contact
            </h3>
            <address className="not-italic flex flex-col gap-3" style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#9C9080', lineHeight: 1.65 }}>
              <span>123 Jewelry District<br />New York, NY 10036</span>
              <a href="mailto:hello@toscointernational.com" className="tosco-footer-contact-link">
                hello@toscointernational.com
              </a>
              <a href="tel:+12125550180" className="tosco-footer-link">
                +1 (212) 555-0180
              </a>
              <span>Mon–Sat 10am–7pm</span>
            </address>
          </div>

        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8" aria-hidden="true">
        <div style={{ height: '1px', backgroundColor: '#E8E2D5', opacity: 0.12 }} />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#9C9080', letterSpacing: '0.02em' }}>
            &copy; 2024 Tosco International Inc. All rights reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#9C9080', letterSpacing: '0.02em' }}>
            Founded by Asit &amp; Aditi Shrimal
          </p>
        </div>
      </div>
    </footer>
  )
}

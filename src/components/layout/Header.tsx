'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Bridal', href: '/collections?category=Bridal' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: scrolled ? '#FAF7F2' : 'transparent',
          boxShadow: scrolled ? '0 1px 0 #E8E2D5, 0 2px 16px rgba(26,26,26,0.06)' : 'none',
          transition: 'background-color 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
          height: '80px',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" aria-label="Tosco International Inc. — Home" className="flex flex-col items-start">
            <span style={{ fontFamily: 'var(--font-cormorant)', color: '#B8935A', fontSize: '24px', letterSpacing: '0.15em', fontWeight: 600, lineHeight: 1 }}>
              TOSCO
            </span>
            <span style={{ fontFamily: 'var(--font-inter)', color: '#9C9080', fontSize: '8px', letterSpacing: '0.18em', lineHeight: 1, marginTop: '3px' }}>
              INTERNATIONAL
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href.split('?')[0] + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-[11px] font-medium uppercase ${active ? 'tosco-nav-link-active' : 'tosco-nav-link'}`}
                  style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.1em' }}
                >
                  {label}
                  {active && (
                    <span className="absolute -bottom-[3px] left-0 right-0 h-px" style={{ backgroundColor: '#B8935A' }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-5">
            <button aria-label="Wishlist" className="tosco-icon-btn p-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <Link
              href="/contact"
              className="tosco-inquire-btn inline-flex items-center px-5 py-2 text-[11px] font-medium uppercase"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.12em' }}
            >
              Inquire
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 tosco-icon-btn"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="8" x2="21" y2="8" /><line x1="3" y1="16" x2="21" y2="16" /></>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-40 flex flex-col md:hidden"
        style={{
          backgroundColor: '#FAF7F2',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
        aria-hidden={!mobileOpen}
      >
        <div style={{ height: '80px', flexShrink: 0 }} />
        <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-8" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href }, i) => {
            const active = pathname === href || pathname.startsWith(href.split('?')[0] + '/')
            return (
              <Link
                key={href}
                href={href}
                className="text-[13px] font-medium uppercase"
                style={{
                  fontFamily: 'var(--font-inter)',
                  letterSpacing: '0.14em',
                  color: active ? '#B8935A' : '#1A1A1A',
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.35s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.05 + 0.1}s, transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.05 + 0.1}s`,
                }}
              >
                {label}
              </Link>
            )
          })}
          <div style={{ opacity: mobileOpen ? 1 : 0, transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.35s 0.35s, transform 0.35s 0.35s', marginTop: '16px' }}>
            <Link href="/contact" className="tosco-inquire-btn inline-flex items-center px-8 py-3 text-[11px] font-medium uppercase" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}>
              Inquire
            </Link>
          </div>
        </nav>
        <div className="pb-8 flex items-center justify-center" style={{ opacity: mobileOpen ? 1 : 0, transition: 'opacity 0.35s 0.4s' }}>
          <span style={{ fontFamily: 'var(--font-inter)', color: '#9C9080', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Tosco International Inc.
          </span>
        </div>
      </div>

      <div className="h-16 md:h-20" aria-hidden="true" />
    </>
  )
}

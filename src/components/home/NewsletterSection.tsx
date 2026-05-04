'use client'

import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setFormState('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      })

      if (res.ok) {
        setFormState('success')
        setEmail('')
        setName('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data?.error || 'Something went wrong. Please try again.')
        setFormState('error')
      }
    } catch {
      setErrorMessage('Unable to connect. Please try again.')
      setFormState('error')
    }
  }

  return (
    <section
      className="relative py-24 px-4 overflow-hidden grain-overlay"
      style={{ background: '#1A1A1A' }}
    >
      {/* Radial gold glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(184,147,90,0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 30% at 20% 80%, rgba(184,147,90,0.06) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <p
          className="mb-4 text-xs uppercase tracking-luxury"
          style={{ color: '#B8935A', letterSpacing: '0.12em' }}
        >
          Join Our Circle
        </p>

        {/* Heading */}
        <h2
          className="font-display mb-4 text-3xl font-light italic tracking-display md:text-4xl"
          style={{ color: '#FAF7F2', letterSpacing: '-0.03em' }}
        >
          Receive 10% Off Your First Piece
        </h2>

        {/* Divider */}
        <div
          className="mx-auto my-6 h-px w-12"
          style={{ background: 'rgba(184,147,90,0.4)' }}
        />

        {/* Subtext */}
        <p
          className="mb-10 text-base leading-relaxed"
          style={{ color: '#9C9080', lineHeight: 1.7 }}
        >
          Join our circle of discerning collectors and be the first to know about new arrivals.
        </p>

        {/* Form or success */}
        {formState === 'success' ? (
          <div
            className="flex flex-col items-center gap-4 rounded-sm py-10"
            style={{ border: '1px solid rgba(184,147,90,0.3)' }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'rgba(184,147,90,0.15)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 10l4 4 8-8"
                  stroke="#B8935A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              className="font-display text-xl font-light italic"
              style={{ color: '#FAF7F2' }}
            >
              Welcome to the Tosco Circle
            </p>
            <p className="text-sm" style={{ color: '#9C9080' }}>
              Your discount code will arrive in your inbox shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Name (optional) */}
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-5 py-4 text-sm"
                style={{
                  background: 'rgba(250,247,242,0.06)',
                  border: '1px solid rgba(250,247,242,0.12)',
                  color: '#FAF7F2',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,147,90,0.5)'
                }}
                onBlur={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(250,247,242,0.12)'
                }}
              />

              {/* Email */}
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 text-sm"
                style={{
                  background: 'rgba(250,247,242,0.06)',
                  border: '1px solid rgba(250,247,242,0.12)',
                  color: '#FAF7F2',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,147,90,0.5)'
                }}
                onBlur={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(250,247,242,0.12)'
                }}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={formState === 'loading'}
                className="px-8 py-4 text-sm font-medium uppercase tracking-luxury"
                style={{
                  background: '#B8935A',
                  color: '#FAF7F2',
                  letterSpacing: '0.12em',
                  border: 'none',
                  cursor: formState === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: formState === 'loading' ? 0.7 : 1,
                  transition:
                    'background 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s, transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (formState !== 'loading') {
                    ;(e.currentTarget as HTMLElement).style.background = '#8B6E3E'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = '#B8935A'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
              >
                {formState === 'loading' ? 'Joining…' : 'Join'}
              </button>
            </div>

            {/* Error */}
            {formState === 'error' && errorMessage && (
              <p className="text-sm" style={{ color: '#E07070' }}>
                {errorMessage}
              </p>
            )}

            {/* Privacy note */}
            <p className="text-xs" style={{ color: 'rgba(156,144,128,0.6)' }}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

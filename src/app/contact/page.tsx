'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'
import type { Metadata } from 'next'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'contact' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Header />
      <main className="pt-20" style={{ background: '#FAF7F2' }}>
        {/* Header */}
        <section className="py-16 text-center" style={{ borderBottom: '1px solid #E8E2D5' }}>
          <p style={{ color: '#B8935A', letterSpacing: '0.12em', fontSize: '11px' }} className="uppercase font-sans mb-3">Get in Touch</p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', letterSpacing: '-0.02em' }} className="text-5xl font-light">Contact Us</h1>
          <p style={{ color: '#9C9080' }} className="mt-4 font-sans text-sm max-w-md mx-auto leading-relaxed">
            Whether you have a question about a piece, wish to arrange a private viewing, or are considering a custom commission — we are here.
          </p>
        </section>

        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-3xl font-light mb-8">Send a Message</h2>

              {status === 'success' ? (
                <div style={{ background: '#F2EDE4', borderLeft: '3px solid #B8935A' }} className="p-6">
                  <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-2xl font-light">Thank you</p>
                  <p style={{ color: '#9C9080' }} className="font-sans text-sm mt-2">We have received your message and will be in touch within one business day.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  {[
                    { id: 'name', label: 'Your Name', type: 'text', required: true },
                    { id: 'email', label: 'Email Address', type: 'email', required: true },
                    { id: 'phone', label: 'Phone Number', type: 'tel', required: false },
                  ].map(({ id, label, type, required }) => (
                    <div key={id}>
                      <label style={{ color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em' }} className="uppercase font-sans block mb-1.5">
                        {label}{required ? ' *' : ''}
                      </label>
                      <input
                        type={type}
                        required={required}
                        value={form[id as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                        style={{ border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A' }}
                        className="w-full px-4 py-3 font-sans text-sm focus:outline-none"
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em' }} className="uppercase font-sans block mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A' }}
                      className="w-full px-4 py-3 font-sans text-sm focus:outline-none resize-none"
                      placeholder="How may we assist you?"
                    />
                  </div>
                  {status === 'error' && <p className="text-red-600 text-sm font-sans">Something went wrong. Please try again.</p>}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{ background: '#B8935A', color: '#FAF7F2', letterSpacing: '0.1em' }}
                    className="w-full py-4 uppercase font-sans text-xs disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A' }} className="text-3xl font-light mb-8">Visit the Atelier</h2>
              <div className="space-y-6">
                {[
                  { label: 'Address', value: '123 Jewelry District\nNew York, NY 10036' },
                  { label: 'Email', value: 'hello@toscointernational.com' },
                  { label: 'Phone', value: '+1 (212) 555-0180' },
                  { label: 'Hours', value: 'Monday – Saturday\n10:00 am – 7:00 pm ET\nSunday — By appointment' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderBottom: '1px solid #E8E2D5', paddingBottom: '20px' }}>
                    <p style={{ color: '#B8935A', fontSize: '10px', letterSpacing: '0.12em' }} className="uppercase font-sans mb-1">{label}</p>
                    <p style={{ color: '#1A1A1A', lineHeight: '1.7' }} className="font-sans text-sm whitespace-pre-line">{value}</p>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-8" style={{ height: '240px', background: '#F2EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E8E2D5' }}>
                <div className="text-center">
                  <p style={{ color: '#B8935A', fontSize: '28px' }}>◈</p>
                  <p style={{ color: '#9C9080', fontSize: '12px', letterSpacing: '0.08em' }} className="uppercase font-sans mt-2">Jewelry District, New York</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

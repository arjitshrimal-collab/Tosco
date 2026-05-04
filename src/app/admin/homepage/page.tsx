'use client'
import { useState, useEffect } from 'react'

const inputStyle = { border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A', width: '100%', padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: '14px' }
const labelStyle = { color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-inter)', textTransform: 'uppercase' as const }

type Product = { id: string; name: string; category: string; isFeatured: boolean }
type Testimonial = { id: string; author: string; location?: string; content: string; rating: number; isActive: boolean; order: number }

export default function HomepageBuilderPage() {
  const [tab, setTab] = useState<'hero' | 'story' | 'featured' | 'testimonials'>('hero')
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [newT, setNewT] = useState({ author: '', location: '', content: '', rating: 5 })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then(setSettings)
    fetch('/api/admin/products').then((r) => r.json()).then(setProducts)
    fetch('/api/admin/testimonials').then((r) => r.json()).then(setTestimonials)
  }, [])

  async function saveSetting(key: string, value: string) {
    await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) })
    setSettings((s) => ({ ...s, [key]: value }))
  }

  async function toggleFeatured(id: string, current: boolean) {
    await fetch(`/api/admin/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isFeatured: !current }) })
    setProducts((p) => p.map((x) => x.id === id ? { ...x, isFeatured: !current } : x))
  }

  async function handleImageUpload(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const fd = new FormData(); fd.append('file', file); fd.append('module', 'homepage'); fd.append('id', key)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    saveSetting(key, data.url)
  }

  async function addTestimonial() {
    if (!newT.author || !newT.content) return
    const res = await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newT, order: testimonials.length }) })
    const t = await res.json()
    setTestimonials((arr) => [...arr, t])
    setNewT({ author: '', location: '', content: '', rating: 5 })
  }

  async function deleteTestimonial(id: string) {
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    setTestimonials((arr) => arr.filter((t) => t.id !== id))
  }

  async function toggleTestimonial(id: string, current: boolean) {
    await fetch(`/api/admin/testimonials/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) })
    setTestimonials((arr) => arr.map((t) => t.id === id ? { ...t, isActive: !current } : t))
  }

  const tabs = [['hero', 'Hero'], ['story', 'Legacy Story'], ['featured', 'Featured Products'], ['testimonials', 'Testimonials']] as const

  return (
    <div style={{ maxWidth: '760px' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '32px', fontWeight: 300, marginBottom: '8px' }}>Homepage Builder</h1>
      <p style={{ color: '#9C9080', fontSize: '13px', marginBottom: '24px' }} className="font-sans">Manage what appears on the public homepage.</p>

      {/* Tabs */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: '1px solid #E8E2D5' }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: '8px 20px', fontSize: '12px', letterSpacing: '0.08em', borderBottom: tab === key ? '2px solid #B8935A' : '2px solid transparent', color: tab === key ? '#B8935A' : '#9C9080', fontFamily: 'var(--font-inter)', marginBottom: '-1px' }} className="uppercase">
            {label}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #E8E2D5', padding: '28px' }}>
        {tab === 'hero' && (
          <div className="space-y-5">
            <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '20px', marginBottom: '4px' }}>Hero Section</p>
            <div><label style={labelStyle}>Hero Tagline</label><input style={inputStyle} defaultValue={settings.heroTagline || 'Where Every Piece Tells a Story'} onBlur={(e) => saveSetting('heroTagline', e.target.value)} /></div>
            <div><label style={labelStyle}>Hero Subtext</label><input style={inputStyle} defaultValue={settings.heroSubtext || 'Handcrafted fine jewelry for life\'s most precious moments'} onBlur={(e) => saveSetting('heroSubtext', e.target.value)} /></div>
            <div>
              <label style={labelStyle}>Hero Background Image</label>
              {settings.heroImage && <img src={settings.heroImage} alt="" style={{ height: '100px', objectFit: 'cover', marginBottom: '8px', width: '100%' }} />}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload('heroImage', e)} style={{ fontSize: '13px', color: '#1A1A1A' }} className="font-sans" />
            </div>
          </div>
        )}

        {tab === 'story' && (
          <div className="space-y-5">
            <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '20px', marginBottom: '4px' }}>The Shrimal Legacy Section</p>
            <div><label style={labelStyle}>Section Heading</label><input style={inputStyle} defaultValue={settings.storyHeading || 'A Story Rooted in Craft and Care'} onBlur={(e) => saveSetting('storyHeading', e.target.value)} /></div>
            <div><label style={labelStyle}>Body Text</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={5} defaultValue={settings.storyBody || ''} onBlur={(e) => saveSetting('storyBody', e.target.value)} /></div>
            <div>
              <label style={labelStyle}>Portrait Image</label>
              {settings.storyImage && <img src={settings.storyImage} alt="" style={{ height: '100px', objectFit: 'cover', marginBottom: '8px' }} />}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload('storyImage', e)} style={{ fontSize: '13px', color: '#1A1A1A' }} className="font-sans" />
            </div>
          </div>
        )}

        {tab === 'featured' && (
          <div>
            <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '20px', marginBottom: '4px' }}>Featured Products</p>
            <p style={{ color: '#9C9080', fontSize: '12px', marginBottom: '20px' }} className="font-sans">Toggle which products appear in the Bestsellers section on the homepage.</p>
            <div className="space-y-2">
              {products.map((p) => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', border: '1px solid #E8E2D5', cursor: 'pointer', background: p.isFeatured ? '#FAF7F2' : 'white' }}>
                  <input type="checkbox" checked={p.isFeatured} onChange={() => toggleFeatured(p.id, p.isFeatured)} />
                  <span style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '16px' }}>{p.name}</span>
                  <span style={{ color: '#9C9080', fontSize: '11px', marginLeft: 'auto' }} className="font-sans">{p.category}</span>
                </label>
              ))}
              {products.length === 0 && <p style={{ color: '#9C9080', fontSize: '13px' }} className="font-sans">No products yet. Add products first.</p>}
            </div>
          </div>
        )}

        {tab === 'testimonials' && (
          <div>
            <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '20px', marginBottom: '16px' }}>Testimonials</p>
            <div className="space-y-3 mb-8">
              {testimonials.map((t) => (
                <div key={t.id} style={{ border: '1px solid #E8E2D5', padding: '16px', opacity: t.isActive ? 1 : 0.5 }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '16px' }}>{t.author}{t.location ? ` — ${t.location}` : ''}</p>
                      <p style={{ color: '#9C9080', fontSize: '12px', marginTop: '4px', lineHeight: '1.6' }} className="font-sans">{t.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => toggleTestimonial(t.id, t.isActive)} style={{ fontSize: '11px', color: '#9C9080', border: '1px solid #E8E2D5', padding: '2px 8px' }} className="font-sans">
                        {t.isActive ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => deleteTestimonial(t.id)} style={{ fontSize: '11px', color: '#dc2626', border: '1px solid #fca5a5', padding: '2px 8px' }} className="font-sans">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '18px', marginBottom: '12px' }}>Add Testimonial</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label style={labelStyle}>Author Name *</label><input style={inputStyle} value={newT.author} onChange={(e) => setNewT((t) => ({ ...t, author: e.target.value }))} /></div>
                <div><label style={labelStyle}>Location</label><input style={inputStyle} value={newT.location} onChange={(e) => setNewT((t) => ({ ...t, location: e.target.value }))} /></div>
              </div>
              <div><label style={labelStyle}>Testimonial *</label><textarea style={{ ...inputStyle, resize: 'none' }} rows={3} value={newT.content} onChange={(e) => setNewT((t) => ({ ...t, content: e.target.value }))} /></div>
              <button onClick={addTestimonial} style={{ background: '#B8935A', color: '#FAF7F2', padding: '8px 20px', fontSize: '12px', letterSpacing: '0.08em' }} className="uppercase font-sans">Add</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

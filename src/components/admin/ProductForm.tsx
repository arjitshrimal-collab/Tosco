'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import dynamic from 'next/dynamic'

const TipTapEditor = dynamic(() => import('./TipTapEditor'), { ssr: false, loading: () => <div style={{ height: '200px', background: '#f9f9f9', border: '1px solid #E8E2D5' }} /> })

type ProductImage = { id?: string; url: string; thumbUrl?: string; mediumUrl?: string; alt?: string; order: number; isPrimary: boolean; isNew?: boolean; file?: File }
type Collection = { id: string; name: string }
type Product = {
  id?: string; name: string; slug: string; category: string; description?: string
  price?: number | null; showPrice: boolean; specs?: string | null; isFeatured: boolean
  inStock: boolean; seoTitle?: string; seoDescription?: string; collectionId?: string | null
  images?: ProductImage[]
}

const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bridal', 'Custom']

const inputStyle = { border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A', width: '100%', padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: '14px' }
const labelStyle = { color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-inter)', textTransform: 'uppercase' as const }

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || 'Rings',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    showPrice: product?.showPrice || false,
    isFeatured: product?.isFeatured || false,
    inStock: product?.inStock ?? true,
    collectionId: product?.collectionId || '',
    seoTitle: product?.seoTitle || '',
    seoDescription: product?.seoDescription || '',
    specsM: '',
    specsS: '',
    specsW: '',
    specsD: '',
  })
  const [images, setImages] = useState<ProductImage[]>(product?.images?.map((img) => ({ ...img, isNew: false })) || [])
  const [collections, setCollections] = useState<Collection[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    fetch('/api/admin/collections').then((r) => r.json()).then(setCollections).catch(() => {})
    if (product?.specs) {
      try {
        const s = JSON.parse(product.specs)
        setForm((f) => ({ ...f, specsM: s.metal || '', specsS: s.stone || '', specsW: s.weight || '', specsD: s.dimensions || '' }))
      } catch {}
    }
  }, [])

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, ...(product ? {} : { slug: slugify(name) }) }))
  }

  async function uploadFile(file: File, tempId: string): Promise<ProductImage | null> {
    const productId = product?.id || `temp-${Date.now()}`
    const fd = new FormData()
    fd.append('file', file)
    fd.append('module', 'products')
    fd.append('id', productId)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      return { id: tempId, url: data.url, thumbUrl: data.thumbUrl, mediumUrl: data.mediumUrl, alt: file.name.replace(/\.[^.]+$/, ''), order: images.length, isPrimary: images.length === 0, isNew: true }
    } catch { return null }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    for (const file of files) {
      const tempId = `temp-${Date.now()}-${Math.random()}`
      setImages((imgs) => [...imgs, { id: tempId, url: URL.createObjectURL(file), order: imgs.length, isPrimary: imgs.length === 0, isNew: true, file }])
      const uploaded = await uploadFile(file, tempId)
      if (uploaded) {
        setImages((imgs) => imgs.map((img) => img.id === tempId ? uploaded : img))
      }
    }
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    for (const file of files) {
      const tempId = `temp-${Date.now()}-${Math.random()}`
      setImages((imgs) => [...imgs, { id: tempId, url: URL.createObjectURL(file), order: imgs.length, isPrimary: imgs.length === 0, isNew: true, file }])
      const uploaded = await uploadFile(file, tempId)
      if (uploaded) setImages((imgs) => imgs.map((img) => img.id === tempId ? uploaded : img))
    }
  }

  async function save() {
    if (!form.name || !form.slug) { setError('Name and slug are required'); return }
    setSaving(true); setError('')
    const specs = JSON.stringify({ metal: form.specsM, stone: form.specsS, weight: form.specsW, dimensions: form.specsD })
    const body = {
      name: form.name, slug: form.slug, category: form.category, description: form.description,
      price: form.price ? parseFloat(form.price) : null,
      showPrice: form.showPrice, isFeatured: form.isFeatured, inStock: form.inStock,
      collectionId: form.collectionId || null, seoTitle: form.seoTitle, seoDescription: form.seoDescription,
      specs,
      images: images.map((img, i) => ({ id: img.isNew ? undefined : img.id, url: img.url, thumbUrl: img.thumbUrl, mediumUrl: img.mediumUrl, alt: img.alt, order: i, isPrimary: img.isPrimary })),
    }
    const url = product?.id ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const method = product?.id ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { router.push('/admin/products') } else {
      const d = await res.json(); setError(d.error || 'Save failed'); setSaving(false)
    }
  }

  const section = (title: string) => (
    <div style={{ borderBottom: '1px solid #E8E2D5', paddingBottom: '24px', marginBottom: '24px' }}>
      <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '20px', fontWeight: 400, marginBottom: '16px' }}>{title}</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '860px' }}>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/admin/products')} style={{ color: '#9C9080', fontSize: '12px', letterSpacing: '0.06em' }} className="uppercase font-sans">← Back</button>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '32px', fontWeight: 300 }}>
          {product?.id ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }} className="font-sans">{error}</div>}

      <div style={{ background: 'white', border: '1px solid #E8E2D5', padding: '32px' }}>
        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label style={labelStyle}>Name *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Collection</label>
            <select style={inputStyle} value={form.collectionId} onChange={(e) => setForm({ ...form, collectionId: e.target.value })}>
              <option value="">None</option>
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4 mb-6" style={{ borderTop: '1px solid #E8E2D5', paddingTop: '24px' }}>
          <div>
            <label style={labelStyle}>Price (USD)</label>
            <input style={inputStyle} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Leave blank for 'Price on request'" />
          </div>
          <div className="flex flex-col justify-end pb-2">
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.showPrice} onChange={(e) => setForm({ ...form, showPrice: e.target.checked })} />
              Show price publicly
            </label>
          </div>
        </div>

        {/* Specs */}
        <div style={{ borderTop: '1px solid #E8E2D5', paddingTop: '24px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '18px', marginBottom: '12px' }}>Specifications</p>
          <div className="grid grid-cols-2 gap-4">
            {[['Metal', 'specsM', 'e.g. 18k Yellow Gold'], ['Stone', 'specsS', 'e.g. 1.2ct Round Diamond'], ['Weight', 'specsW', 'e.g. 4.2g'], ['Dimensions', 'specsD', 'e.g. 18mm × 14mm']].map(([label, key, ph]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input style={inputStyle} value={form[key as keyof typeof form] as string} placeholder={ph} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ borderTop: '1px solid #E8E2D5', paddingTop: '24px', marginBottom: '24px' }}>
          <label style={labelStyle}>Description</label>
          <TipTapEditor value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        </div>

        {/* Images */}
        <div style={{ borderTop: '1px solid #E8E2D5', paddingTop: '24px', marginBottom: '24px' }}>
          <label style={labelStyle}>Images</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{ border: `2px dashed ${dragOver ? '#B8935A' : '#E8E2D5'}`, padding: '32px', textAlign: 'center', background: dragOver ? '#FAF7F2' : 'white', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
            onClick={() => document.getElementById('img-input')?.click()}
          >
            <p style={{ color: '#9C9080', fontSize: '13px' }} className="font-sans">Drop images here or click to browse</p>
            <p style={{ color: '#B8935A', fontSize: '11px', letterSpacing: '0.06em', marginTop: '4px' }} className="uppercase font-sans">JPG, PNG, WebP</p>
          </div>
          <input id="img-input" type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {images.map((img, i) => (
                <div key={img.id || i} style={{ border: img.isPrimary ? '2px solid #B8935A' : '1px solid #E8E2D5', padding: '4px' }}>
                  <div style={{ aspectRatio: '3/4', position: 'relative', background: '#F2EDE4' }}>
                    <img src={img.url} alt={img.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="mt-1 space-y-1">
                    <input value={img.alt || ''} onChange={(e) => setImages(imgs => imgs.map((x, xi) => xi === i ? { ...x, alt: e.target.value } : x))}
                      placeholder="Alt text" style={{ border: '1px solid #E8E2D5', fontSize: '11px', padding: '2px 4px', width: '100%' }} className="font-sans" />
                    <div className="flex gap-1">
                      <button onClick={() => setImages(imgs => imgs.map((x, xi) => ({ ...x, isPrimary: xi === i })))}
                        style={{ fontSize: '10px', color: img.isPrimary ? '#B8935A' : '#9C9080', border: '1px solid #E8E2D5', padding: '1px 4px', flex: 1 }} className="font-sans">
                        {img.isPrimary ? '★ Primary' : 'Set primary'}
                      </button>
                      <button onClick={() => setImages(imgs => imgs.filter((_, xi) => xi !== i))}
                        style={{ fontSize: '10px', color: '#dc2626', border: '1px solid #fca5a5', padding: '1px 6px' }} className="font-sans">×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flags */}
        <div style={{ borderTop: '1px solid #E8E2D5', paddingTop: '24px', marginBottom: '24px' }} className="flex flex-wrap gap-6">
          {[['isFeatured', 'Featured on homepage'], ['inStock', 'In stock']].map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#1A1A1A' }} className="font-sans">
              <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
              {label}
            </label>
          ))}
        </div>

        {/* SEO */}
        <div style={{ borderTop: '1px solid #E8E2D5', paddingTop: '24px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '18px', marginBottom: '12px' }}>SEO</p>
          <div className="space-y-3">
            <div><label style={labelStyle}>Meta Title</label><input style={inputStyle} value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div>
            <div><label style={labelStyle}>Meta Description</label><textarea style={{ ...inputStyle, resize: 'none' }} rows={3} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></div>
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          style={{ background: '#B8935A', color: '#FAF7F2', letterSpacing: '0.1em', padding: '12px 32px', fontSize: '12px' }}
          className="uppercase font-sans disabled:opacity-60"
        >
          {saving ? 'Saving…' : product?.id ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </div>
  )
}

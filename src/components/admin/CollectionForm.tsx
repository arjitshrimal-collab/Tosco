'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'

type Collection = { id?: string; name: string; slug: string; description?: string; heroImage?: string; isActive: boolean; order: number }
const inputStyle = { border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A', width: '100%', padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: '14px' }
const labelStyle = { color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-inter)', textTransform: 'uppercase' as const }

export default function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: collection?.name || '', slug: collection?.slug || '', description: collection?.description || '', heroImage: collection?.heroImage || '', isActive: collection?.isActive ?? true, order: collection?.order ?? 0 })
  const [saving, setSaving] = useState(false); const [error, setError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const fd = new FormData(); fd.append('file', file); fd.append('module', 'collections'); fd.append('id', collection?.id || `new-${Date.now()}`)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setForm((f) => ({ ...f, heroImage: data.url }))
  }

  async function save() {
    if (!form.name || !form.slug) { setError('Name and slug required'); return }
    setSaving(true); setError('')
    const url = collection?.id ? `/api/admin/collections/${collection.id}` : '/api/admin/collections'
    const method = collection?.id ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { router.push('/admin/collections') } else { const d = await res.json(); setError(d.error || 'Save failed'); setSaving(false) }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/admin/collections')} style={{ color: '#9C9080', fontSize: '12px' }} className="uppercase font-sans">← Back</button>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '32px', fontWeight: 300 }}>{collection?.id ? 'Edit Collection' : 'New Collection'}</h1>
      </div>
      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
      <div style={{ background: 'white', border: '1px solid #E8E2D5', padding: '32px' }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, ...(collection ? {} : { slug: slugify(e.target.value) }) }))} /></div>
          <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} /></div>
        </div>
        <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: 'none' }} rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
        <div><label style={labelStyle}>Hero Image</label>
          {form.heroImage && <img src={form.heroImage} alt="" style={{ height: '80px', objectFit: 'cover', marginBottom: '8px' }} />}
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '13px', color: '#1A1A1A' }} className="font-sans" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Order</label><input type="number" style={inputStyle} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} /></div>
          <div className="flex items-end pb-1"><label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#1A1A1A', fontFamily: 'var(--font-inter)' }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />Active
          </label></div>
        </div>
        <button onClick={save} disabled={saving} style={{ background: '#B8935A', color: '#FAF7F2', padding: '12px 32px', fontSize: '12px', letterSpacing: '0.1em' }} className="uppercase font-sans disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Collection'}
        </button>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import dynamic from 'next/dynamic'

const TipTapEditor = dynamic(() => import('./TipTapEditor'), { ssr: false })

type Post = { id?: string; title: string; slug: string; excerpt?: string; content: string; coverImage?: string; isPublished: boolean; seoTitle?: string; seoDescription?: string }
const inputStyle = { border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A', width: '100%', padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: '14px' }
const labelStyle = { color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-inter)', textTransform: 'uppercase' as const }

export default function JournalPostForm({ post }: { post?: Post }) {
  const router = useRouter()
  const [form, setForm] = useState({ title: post?.title || '', slug: post?.slug || '', excerpt: post?.excerpt || '', content: post?.content || '', coverImage: post?.coverImage || '', isPublished: post?.isPublished || false, seoTitle: post?.seoTitle || '', seoDescription: post?.seoDescription || '' })
  const [saving, setSaving] = useState(false); const [error, setError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const fd = new FormData(); fd.append('file', file); fd.append('module', 'journal'); fd.append('id', post?.id || `new-${Date.now()}`)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setForm((f) => ({ ...f, coverImage: data.url }))
  }

  async function save() {
    if (!form.title) { setError('Title required'); return }
    setSaving(true); setError('')
    const slug = form.slug || slugify(form.title)
    const url = post?.id ? `/api/admin/journal/${post.id}` : '/api/admin/journal'
    const method = post?.id ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, slug }) })
    if (res.ok) { router.push('/admin/journal') } else { const d = await res.json(); setError(d.error || 'Save failed'); setSaving(false) }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/admin/journal')} style={{ color: '#9C9080', fontSize: '12px' }} className="uppercase font-sans">← Back</button>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '32px', fontWeight: 300 }}>{post?.id ? 'Edit Post' : 'New Post'}</h1>
      </div>
      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', marginBottom: '16px' }}>{error}</div>}
      <div style={{ background: 'white', border: '1px solid #E8E2D5', padding: '32px' }} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, ...(post ? {} : { slug: slugify(e.target.value) }) }))} /></div>
          <div><label style={labelStyle}>Slug</label><input style={inputStyle} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} /></div>
        </div>
        <div><label style={labelStyle}>Excerpt</label><textarea style={{ ...inputStyle, resize: 'none' }} rows={2} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} /></div>
        <div><label style={labelStyle}>Content</label><TipTapEditor value={form.content} onChange={(v) => setForm((f) => ({ ...f, content: v }))} /></div>
        <div><label style={labelStyle}>Cover Image</label>
          {form.coverImage && <img src={form.coverImage} alt="" style={{ height: '80px', objectFit: 'cover', marginBottom: '8px' }} />}
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '13px', color: '#1A1A1A' }} className="font-sans" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>SEO Title</label><input style={inputStyle} value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} /></div>
          <div><label style={labelStyle}>SEO Description</label><input style={inputStyle} value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} /></div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#1A1A1A', fontFamily: 'var(--font-inter)' }}>
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />Published (visible publicly)
        </label>
        <button onClick={save} disabled={saving} style={{ background: '#B8935A', color: '#FAF7F2', padding: '12px 32px', fontSize: '12px', letterSpacing: '0.1em' }} className="uppercase font-sans disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Post'}
        </button>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminProductActions({ id }: { id: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    router.refresh()
    setDeleting(false)
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/admin/products/${id}/edit`}
        style={{ color: '#B8935A', fontSize: '12px', letterSpacing: '0.06em', border: '1px solid #B8935A', padding: '3px 10px' }}
        className="uppercase font-sans"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        style={{ color: '#dc2626', fontSize: '12px', letterSpacing: '0.06em', border: '1px solid #fca5a5', padding: '3px 10px' }}
        className="uppercase font-sans disabled:opacity-40"
      >
        {deleting ? '…' : 'Delete'}
      </button>
    </div>
  )
}

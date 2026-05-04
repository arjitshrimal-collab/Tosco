import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminCollectionActions from '@/components/admin/AdminCollectionActions'

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '32px', fontWeight: 300 }}>Collections</h1>
        <Link href="/admin/collections/new" style={{ background: '#B8935A', color: '#FAF7F2', letterSpacing: '0.08em', fontSize: '12px' }} className="px-5 py-2.5 uppercase font-sans">
          Add Collection
        </Link>
      </div>
      <div style={{ background: 'white', border: '1px solid #E8E2D5' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E2D5' }}>
              {['Name', 'Slug', 'Products', 'Active', 'Order', 'Actions'].map((h) => (
                <th key={h} style={{ color: '#9C9080', fontSize: '10px', letterSpacing: '0.1em', textAlign: 'left', padding: '12px 16px' }} className="uppercase font-sans">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {collections.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#9C9080' }} className="font-sans text-sm">No collections yet.</td></tr>
            ) : collections.map((col, i) => (
              <tr key={col.id} style={{ borderBottom: i < collections.length - 1 ? '1px solid #E8E2D5' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '16px' }}>{col.name}</p>
                </td>
                <td style={{ padding: '12px 16px', color: '#9C9080', fontSize: '12px' }} className="font-sans">{col.slug}</td>
                <td style={{ padding: '12px 16px', color: '#2D2D2D', fontSize: '13px' }} className="font-sans">{col._count.products}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: col.isActive ? '#059669' : '#9C9080', fontSize: '11px' }} className="font-sans">{col.isActive ? 'Active' : 'Hidden'}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#9C9080', fontSize: '13px' }} className="font-sans">{col.order}</td>
                <td style={{ padding: '12px 16px' }}><AdminCollectionActions id={col.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

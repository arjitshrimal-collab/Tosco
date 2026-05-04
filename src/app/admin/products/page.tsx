import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import AdminProductActions from '@/components/admin/AdminProductActions'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams

  const products = await prisma.product.findMany({
    where: search ? { name: { contains: search } } : {},
    include: { images: { where: { isPrimary: true }, take: 1 }, collection: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '32px', fontWeight: 300 }}>Products</h1>
          <p style={{ color: '#9C9080' }} className="font-sans text-sm mt-1">{products.length} total pieces</p>
        </div>
        <Link
          href="/admin/products/new"
          style={{ background: '#B8935A', color: '#FAF7F2', letterSpacing: '0.08em', fontSize: '12px' }}
          className="px-5 py-2.5 uppercase font-sans"
        >
          Add Product
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search products…"
          style={{ border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A', width: '280px' }}
          className="px-4 py-2 font-sans text-sm focus:outline-none"
        />
      </form>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #E8E2D5', boxShadow: '0 1px 4px rgba(26,26,26,0.05)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E2D5' }}>
              {['Image', 'Name', 'Category', 'Collection', 'Price', 'Featured', 'Stock', 'Views', 'Actions'].map((h) => (
                <th key={h} style={{ color: '#9C9080', fontSize: '10px', letterSpacing: '0.1em', textAlign: 'left', padding: '12px 16px' }} className="uppercase font-sans">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#9C9080' }} className="font-sans text-sm">No products yet. Add your first piece.</td></tr>
            ) : products.map((product, i) => (
              <tr key={product.id} style={{ borderBottom: i < products.length - 1 ? '1px solid #E8E2D5' : 'none' }} className="hover:bg-gray-50">
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ width: '48px', height: '60px', background: '#F2EDE4', position: 'relative', overflow: 'hidden' }}>
                    {product.images[0] && (
                      <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                    )}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '16px', fontWeight: 400 }}>{product.name}</p>
                  <p style={{ color: '#9C9080', fontSize: '11px' }} className="font-sans">{product.slug}</p>
                </td>
                <td style={{ padding: '12px 16px', color: '#2D2D2D', fontSize: '13px' }} className="font-sans">{product.category}</td>
                <td style={{ padding: '12px 16px', color: '#2D2D2D', fontSize: '13px' }} className="font-sans">{product.collection?.name || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#2D2D2D', fontSize: '13px' }} className="font-sans">
                  {product.showPrice && product.price ? `$${product.price.toLocaleString()}` : '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: product.isFeatured ? '#B8935A22' : 'transparent', color: product.isFeatured ? '#B8935A' : '#9C9080', fontSize: '11px', letterSpacing: '0.06em', padding: '2px 8px', border: '1px solid', borderColor: product.isFeatured ? '#B8935A' : '#E8E2D5' }} className="uppercase font-sans">
                    {product.isFeatured ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: product.inStock ? '#10b98122' : '#ef444422', color: product.inStock ? '#059669' : '#dc2626', fontSize: '11px', letterSpacing: '0.06em', padding: '2px 8px' }} className="uppercase font-sans">
                    {product.inStock ? 'In Stock' : 'Out'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#9C9080', fontSize: '13px' }} className="font-sans">{product.viewCount}</td>
                <td style={{ padding: '12px 16px' }}>
                  <AdminProductActions id={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

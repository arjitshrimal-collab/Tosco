import { prisma } from '@/lib/prisma'
import { Package, MessageSquare, Mail, Eye } from 'lucide-react'

export const metadata = {
  title: 'Dashboard',
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string
  value: number | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>
  accent: string
  sub?: string
}) {
  return (
    <div
      className="bg-white rounded-[8px] p-6 flex items-start gap-4"
      style={{
        boxShadow: '0 1px 4px rgba(26,26,26,0.05), 0 4px 16px rgba(26,26,26,0.06)',
        border: '1px solid #E8E2D5',
      }}
    >
      <div
        className="w-10 h-10 rounded-[6px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${accent}18` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#1A1A1A] leading-none mb-1">{value}</p>
        <p className="text-xs font-medium text-[#9C9080] uppercase tracking-[0.08em]">{label}</p>
        {sub && <p className="text-[11px] text-[#9C9080] mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [totalProducts, unreadInquiries, subscriberCount, topProducts, recentInquiries] =
    await Promise.all([
      prisma.product.count(),
      prisma.inquiry.count({
        where: {
          isRead: false,
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.newsletterSubscriber.count(),
      prisma.product.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          name: true,
          category: true,
          viewCount: true,
          isFeatured: true,
        },
      }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { name: true } },
        },
      }),
    ])

  const totalViews = topProducts.reduce((sum, p) => sum + p.viewCount, 0)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold text-[#1A1A1A] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif' }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[#9C9080] mt-1">
          Welcome back — here&apos;s what&apos;s happening at Tosco.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Products"
          value={totalProducts}
          icon={Package}
          accent="#B8935A"
        />
        <StatCard
          label="Inquiries (7d)"
          value={unreadInquiries}
          icon={MessageSquare}
          accent="#6B8F71"
          sub="Unread in last 7 days"
        />
        <StatCard
          label="Subscribers"
          value={subscriberCount}
          icon={Mail}
          accent="#7B9EC0"
        />
        <StatCard
          label="Top Product Views"
          value={totalViews}
          icon={Eye}
          accent="#9C7080"
          sub="Across top 5 products"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent inquiries table */}
        <div
          className="xl:col-span-3 bg-white rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0 1px 4px rgba(26,26,26,0.05), 0 4px 16px rgba(26,26,26,0.06)',
            border: '1px solid #E8E2D5',
          }}
        >
          <div className="px-6 py-4 border-b border-[#E8E2D5] flex items-center justify-between">
            <h2
              className="text-lg font-semibold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif' }}
            >
              Recent Inquiries
            </h2>
            <a
              href="/admin/inquiries"
              className="text-xs text-[#B8935A] hover:text-[#8B6E3E] font-medium transition-colors duration-150"
            >
              View all
            </a>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[#9C9080]">
              No inquiries yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E2D5]">
                    {['Name', 'Email', 'Product', 'Date', 'Status'].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.10em] text-[#9C9080]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inquiry, idx) => (
                    <tr
                      key={inquiry.id}
                      className={`
                        border-b border-[#E8E2D5] last:border-0
                        ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/40'}
                      `}
                    >
                      <td className="px-6 py-3.5 font-medium text-[#1A1A1A] whitespace-nowrap">
                        {inquiry.name}
                      </td>
                      <td className="px-6 py-3.5 text-[#9C9080] whitespace-nowrap">
                        {inquiry.email}
                      </td>
                      <td className="px-6 py-3.5 text-[#9C9080] max-w-[160px] truncate">
                        {inquiry.product?.name ?? (
                          <span className="italic text-[#9C9080]/60">General</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-[#9C9080] whitespace-nowrap">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`
                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide
                            ${
                              inquiry.isRead
                                ? 'bg-[#E8E2D5] text-[#9C9080]'
                                : 'bg-[#B8935A]/15 text-[#8B6E3E]'
                            }
                          `}
                        >
                          {inquiry.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top products list */}
        <div
          className="xl:col-span-2 bg-white rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0 1px 4px rgba(26,26,26,0.05), 0 4px 16px rgba(26,26,26,0.06)',
            border: '1px solid #E8E2D5',
          }}
        >
          <div className="px-6 py-4 border-b border-[#E8E2D5] flex items-center justify-between">
            <h2
              className="text-lg font-semibold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif' }}
            >
              Top Products
            </h2>
            <a
              href="/admin/products"
              className="text-xs text-[#B8935A] hover:text-[#8B6E3E] font-medium transition-colors duration-150"
            >
              View all
            </a>
          </div>

          {topProducts.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[#9C9080]">
              No products yet.
            </div>
          ) : (
            <ul className="divide-y divide-[#E8E2D5]">
              {topProducts.map((product, idx) => (
                <li
                  key={product.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <span className="text-base font-semibold text-[#E8E2D5] w-5 text-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{product.name}</p>
                    <p className="text-[11px] text-[#9C9080] mt-0.5 uppercase tracking-[0.06em]">
                      {product.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Eye size={12} className="text-[#9C9080]" />
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                      {product.viewCount.toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

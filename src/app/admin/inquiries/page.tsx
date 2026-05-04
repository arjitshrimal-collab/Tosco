import { prisma } from '@/lib/prisma'
import InquiriesTable from '@/components/admin/InquiriesTable'

export const metadata = {
  title: 'Inquiries',
}

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { name: true } },
    },
  })

  const unreadCount = inquiries.filter((i) => !i.isRead).length

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1
            className="text-3xl font-semibold text-[#1A1A1A] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif' }}
          >
            Inquiries
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-[#B8935A]/15 text-[#8B6E3E] text-xs font-semibold">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-sm text-[#9C9080] mt-1">
          {inquiries.length} total {inquiries.length === 1 ? 'inquiry' : 'inquiries'} — click a
          row to view details and mark as read.
        </p>
      </div>

      <InquiriesTable inquiries={inquiries} />
    </div>
  )
}

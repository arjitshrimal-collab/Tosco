import { prisma } from '@/lib/prisma'
import { Mail, Download, Users } from 'lucide-react'

export const metadata = {
  title: 'Newsletter',
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-3xl font-semibold text-[#1A1A1A] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif' }}
          >
            Newsletter
          </h1>
          <p className="text-sm text-[#9C9080] mt-1">
            Manage your subscriber list and export data.
          </p>
        </div>

        {/* Export button */}
        <a
          href="/api/admin/newsletter/export"
          download
          className="
            inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px]
            bg-[#B8935A] text-white text-sm font-medium
            hover:bg-[#D4AC72] active:bg-[#8B6E3E]
            transition-colors duration-150
            focus-visible:outline-2 focus-visible:outline-[#B8935A] focus-visible:outline-offset-2
          "
          style={{
            boxShadow: '0 1px 4px rgba(184,147,90,0.30), 0 4px 16px rgba(184,147,90,0.15)',
          }}
        >
          <Download size={14} />
          Export CSV
        </a>
      </div>

      {/* Summary card */}
      <div
        className="bg-white rounded-[8px] p-6 flex items-center gap-5 mb-6"
        style={{
          boxShadow: '0 1px 4px rgba(26,26,26,0.05), 0 4px 16px rgba(26,26,26,0.06)',
          border: '1px solid #E8E2D5',
        }}
      >
        <div className="w-12 h-12 rounded-[6px] bg-[#B8935A]/12 flex items-center justify-center flex-shrink-0">
          <Users size={20} className="text-[#B8935A]" />
        </div>
        <div>
          <p className="text-3xl font-semibold text-[#1A1A1A] leading-none">
            {subscribers.length.toLocaleString()}
          </p>
          <p className="text-xs font-medium text-[#9C9080] uppercase tracking-[0.08em] mt-1">
            Total Subscribers
          </p>
        </div>
      </div>

      {/* Subscriber table */}
      <div
        className="bg-white rounded-[8px] overflow-hidden"
        style={{
          boxShadow: '0 1px 4px rgba(26,26,26,0.05), 0 4px 16px rgba(26,26,26,0.06)',
          border: '1px solid #E8E2D5',
        }}
      >
        <div className="px-6 py-4 border-b border-[#E8E2D5]">
          <h2
            className="text-lg font-semibold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif' }}
          >
            Subscriber List
          </h2>
        </div>

        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#9C9080]">
            <Mail size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No subscribers yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E2D5]">
                  {['#', 'Email', 'Name', 'Subscribed'].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.10em] text-[#9C9080] whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, idx) => (
                  <tr
                    key={sub.id}
                    className={`
                      border-b border-[#E8E2D5] last:border-0
                      ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/40'}
                    `}
                  >
                    <td className="px-6 py-3.5 text-[#9C9080]/60 text-xs tabular-nums">
                      {subscribers.length - idx}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-[#1A1A1A]">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-[#9C9080] flex-shrink-0" />
                        {sub.email}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[#9C9080]">
                      {sub.name ?? <span className="text-[#9C9080]/40 italic">—</span>}
                    </td>
                    <td className="px-6 py-3.5 text-[#9C9080]">{formatDate(sub.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

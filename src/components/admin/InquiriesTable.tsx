'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Mail, Package, Calendar, MessageSquare } from 'lucide-react'

interface InquiryRow {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  source: string
  isRead: boolean
  createdAt: Date
  product: { name: string } | null
}

interface InquiriesTableProps {
  inquiries: InquiryRow[]
}

type Filter = 'all' | 'unread' | 'read'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default function InquiriesTable({ inquiries }: InquiriesTableProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<InquiryRow | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filtered = inquiries.filter((i) => {
    if (filter === 'unread') return !i.isRead
    if (filter === 'read') return i.isRead
    return true
  })

  const unreadCount = inquiries.filter((i) => !i.isRead).length
  const readCount = inquiries.filter((i) => i.isRead).length

  const markAsRead = async (inquiry: InquiryRow) => {
    setSelected(inquiry)
    if (!inquiry.isRead) {
      try {
        await fetch(`/api/admin/inquiries/${inquiry.id}/read`, { method: 'PATCH' })
        startTransition(() => {
          router.refresh()
        })
      } catch {
        // silently fail — UI still shows detail
      }
    }
  }

  const filters: { label: string; value: Filter; count: number }[] = [
    { label: 'All', value: 'all', count: inquiries.length },
    { label: 'Unread', value: 'unread', count: unreadCount },
    { label: 'Read', value: 'read', count: readCount },
  ]

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-[4px] text-sm font-medium
              transition-colors duration-150
              focus-visible:outline-2 focus-visible:outline-[#B8935A] focus-visible:outline-offset-2
              ${
                filter === f.value
                  ? 'bg-[#B8935A] text-white'
                  : 'bg-white text-[#9C9080] border border-[#E8E2D5] hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
              }
            `}
          >
            {f.label}
            <span
              className={`
                text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                ${filter === f.value ? 'bg-white/25 text-white' : 'bg-[#E8E2D5] text-[#9C9080]'}
              `}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div
          className={`bg-white rounded-[8px] overflow-hidden flex-1 min-w-0 ${selected ? 'xl:flex-[2]' : ''}`}
          style={{
            boxShadow: '0 1px 4px rgba(26,26,26,0.05), 0 4px 16px rgba(26,26,26,0.06)',
            border: '1px solid #E8E2D5',
          }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#9C9080]">
              <MessageSquare size={32} className="mb-3 opacity-30" />
              <p className="text-sm">No inquiries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E2D5]">
                    {['Name', 'Email', 'Phone', 'Message', 'Source', 'Product', 'Date', 'Status'].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.10em] text-[#9C9080] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inquiry, idx) => (
                    <tr
                      key={inquiry.id}
                      onClick={() => markAsRead(inquiry)}
                      className={`
                        border-b border-[#E8E2D5] last:border-0 cursor-pointer
                        transition-colors duration-100
                        ${selected?.id === inquiry.id ? 'bg-[#B8935A]/08' : ''}
                        ${!inquiry.isRead ? 'font-medium' : ''}
                        ${
                          selected?.id !== inquiry.id
                            ? idx % 2 === 0
                              ? 'bg-white hover:bg-[#FAF7F2]'
                              : 'bg-[#FAF7F2]/30 hover:bg-[#FAF7F2]'
                            : ''
                        }
                      `}
                    >
                      <td className="px-5 py-3.5 text-[#1A1A1A] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {!inquiry.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B8935A] flex-shrink-0" />
                          )}
                          {inquiry.name}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#9C9080] whitespace-nowrap">
                        {inquiry.email}
                      </td>
                      <td className="px-5 py-3.5 text-[#9C9080] whitespace-nowrap">
                        {inquiry.phone ?? <span className="text-[#9C9080]/40">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-[#9C9080] max-w-[200px]">
                        <span className="block truncate">{inquiry.message}</span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`
                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide
                            ${
                              inquiry.source === 'product'
                                ? 'bg-[#7B9EC0]/15 text-[#4a6e8f]'
                                : 'bg-[#E8E2D5] text-[#9C9080]'
                            }
                          `}
                        >
                          {inquiry.source}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#9C9080] max-w-[140px]">
                        <span className="block truncate">
                          {inquiry.product?.name ?? (
                            <span className="text-[#9C9080]/40">—</span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#9C9080] whitespace-nowrap text-xs">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
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

        {/* Detail panel */}
        {selected && (
          <div
            className="bg-white rounded-[8px] overflow-hidden flex-shrink-0 w-[320px] self-start"
            style={{
              boxShadow: '0 1px 4px rgba(26,26,26,0.05), 0 4px 16px rgba(26,26,26,0.06)',
              border: '1px solid #E8E2D5',
            }}
          >
            <div className="px-5 py-4 border-b border-[#E8E2D5] flex items-center justify-between">
              <h3
                className="text-base font-semibold text-[#1A1A1A]"
                style={{
                  fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
                }}
              >
                Inquiry Detail
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-[#9C9080] hover:text-[#1A1A1A] text-lg leading-none transition-colors duration-150"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.10em] text-[#9C9080] mb-1">
                  From
                </p>
                <p className="text-sm font-medium text-[#1A1A1A]">{selected.name}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#9C9080]">
                <Mail size={13} />
                <a
                  href={`mailto:${selected.email}`}
                  className="hover:text-[#B8935A] transition-colors duration-150"
                >
                  {selected.email}
                </a>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm text-[#9C9080]">
                  <Phone size={13} />
                  <a
                    href={`tel:${selected.phone}`}
                    className="hover:text-[#B8935A] transition-colors duration-150"
                  >
                    {selected.phone}
                  </a>
                </div>
              )}
              {selected.product && (
                <div className="flex items-center gap-2 text-sm text-[#9C9080]">
                  <Package size={13} />
                  <span>{selected.product.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#9C9080]">
                <Calendar size={13} />
                <span>{formatDate(selected.createdAt)}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E2D5]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.10em] text-[#9C9080] mb-2">
                  Message
                </p>
                <p className="text-sm text-[#2D2D2D] leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your Inquiry to Tosco International`}
                  className="
                    flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[4px]
                    bg-[#B8935A] text-white text-sm font-medium
                    hover:bg-[#D4AC72] active:bg-[#8B6E3E]
                    transition-colors duration-150
                    focus-visible:outline-2 focus-visible:outline-[#B8935A] focus-visible:outline-offset-2
                  "
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

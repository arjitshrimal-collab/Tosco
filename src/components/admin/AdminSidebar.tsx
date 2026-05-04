'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  Layers,
  Home,
  MessageSquare,
  Mail,
  BookOpen,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>
  badge?: number
}

interface AdminSidebarProps {
  unreadCount: number
}

export default function AdminSidebar({ unreadCount }: AdminSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Collections', href: '/admin/collections', icon: Layers },
    { label: 'Homepage', href: '/admin/homepage', icon: Home },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare, badge: unreadCount },
    { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
    { label: 'Journal', href: '/admin/journal', icon: BookOpen },
    { label: 'Pages', href: '/admin/pages', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{ width: '240px' }}
      className="fixed left-0 top-0 h-screen flex flex-col bg-white border-r border-[#E8E2D5] z-50"
    >
      {/* Gold top accent bar */}
      <div className="h-1 w-full bg-[#B8935A] flex-shrink-0" />

      {/* Logo area */}
      <div className="px-6 py-5 border-b border-[#E8E2D5] flex-shrink-0">
        <Link href="/admin" className="block">
          <span
            className="text-xl font-semibold tracking-[0.12em] text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif' }}
          >
            TOSCO
          </span>
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#9C9080] mt-0.5">
            Admin Portal
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-sm font-medium
                    transition-colors duration-150
                    ${
                      active
                        ? 'bg-[#B8935A] text-white'
                        : 'text-[#2D2D2D] hover:bg-[#FAF7F2] hover:text-[#B8935A]'
                    }
                  `}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`
                        text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                        ${active ? 'bg-white/25 text-white' : 'bg-[#B8935A] text-white'}
                      `}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User area */}
      <div className="flex-shrink-0 border-t border-[#E8E2D5] px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#B8935A]/15 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-[#B8935A]">
              {session?.user?.email?.charAt(0).toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#1A1A1A] truncate">
              {session?.user?.name ?? 'Admin'}
            </p>
            <p className="text-[11px] text-[#9C9080] truncate">
              {session?.user?.email ?? ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="
            w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px]
            text-xs font-medium text-[#9C9080] border border-[#E8E2D5]
            hover:bg-[#FAF7F2] hover:text-[#1A1A1A] hover:border-[#D4AC72]
            transition-colors duration-150
            focus-visible:outline-2 focus-visible:outline-[#B8935A] focus-visible:outline-offset-2
            active:scale-[0.98]
          "
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

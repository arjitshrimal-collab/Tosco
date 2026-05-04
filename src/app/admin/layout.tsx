import { auth } from '@/lib/auth'
import { SessionProvider } from 'next-auth/react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: {
    default: 'Admin — Tosco International',
    template: '%s | Admin — Tosco International',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Login page renders without the admin shell — proxy.ts handles auth redirects
  if (!session) {
    return <>{children}</>
  }

  // Fetch unread inquiry count for sidebar badge
  const unreadCount = await prisma.inquiry.count({
    where: { isRead: false },
  })

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[#FAF7F2] flex">
        <AdminSidebar unreadCount={unreadCount} />
        <main
          className="flex-1 min-h-screen"
          style={{ marginLeft: '240px' }}
        >
          <div className="p-8 min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  )
}

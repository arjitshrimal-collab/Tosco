import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminJournalActions from '@/components/admin/AdminJournalActions'

export default async function AdminJournalPage() {
  const posts = await prisma.journalPost.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '32px', fontWeight: 300 }}>Journal</h1>
        <Link href="/admin/journal/new" style={{ background: '#B8935A', color: '#FAF7F2', letterSpacing: '0.08em', fontSize: '12px' }} className="px-5 py-2.5 uppercase font-sans">New Post</Link>
      </div>
      <div style={{ background: 'white', border: '1px solid #E8E2D5' }}>
        <table className="w-full">
          <thead><tr style={{ borderBottom: '1px solid #E8E2D5' }}>
            {['Title', 'Status', 'Date', 'Actions'].map((h) => (
              <th key={h} style={{ color: '#9C9080', fontSize: '10px', letterSpacing: '0.1em', textAlign: 'left', padding: '12px 16px' }} className="uppercase font-sans">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {posts.length === 0 ? <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#9C9080' }} className="font-sans text-sm">No posts yet.</td></tr>
            : posts.map((post, i) => (
              <tr key={post.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid #E8E2D5' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '16px' }}>{post.title}</p>
                  <p style={{ color: '#9C9080', fontSize: '11px' }} className="font-sans">{post.slug}</p>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: post.isPublished ? '#059669' : '#9C9080', fontSize: '11px' }} className="font-sans">{post.isPublished ? 'Published' : 'Draft'}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#9C9080', fontSize: '12px' }} className="font-sans">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px' }}><AdminJournalActions id={post.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

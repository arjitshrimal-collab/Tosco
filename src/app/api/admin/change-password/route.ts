import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) return Response.json({ error: 'Both passwords required' }, { status: 400 })
  if (newPassword.length < 8) return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return Response.json({ error: 'Current password is incorrect' }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

  return Response.json({ success: true })
}

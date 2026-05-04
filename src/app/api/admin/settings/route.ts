export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await prisma.siteSetting.findMany()
  const result: Record<string, string> = {}
  for (const s of settings) result[s.key] = s.value
  return Response.json(result)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { key, value } = body
  if (!key) return Response.json({ error: 'key required' }, { status: 400 })
  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) },
  })
  return Response.json(setting)
}

import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

export async function processUpload(
  buffer: Buffer,
  module: string,
  id: string,
  filename: string
): Promise<{ url: string; thumbUrl: string; mediumUrl: string }> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', module, id)
  await fs.mkdir(uploadDir, { recursive: true })

  const ext = path.extname(filename).toLowerCase() || '.jpg'
  const base = path.basename(filename, ext)

  const originalFilename = `${base}${ext}`
  const thumbFilename = `${base}-thumb${ext}`
  const mediumFilename = `${base}-medium${ext}`

  const originalPath = path.join(uploadDir, originalFilename)
  const thumbPath = path.join(uploadDir, thumbFilename)
  const mediumPath = path.join(uploadDir, mediumFilename)

  // Full size — 2000px wide, preserve aspect ratio
  await sharp(buffer)
    .resize(2000, undefined, { withoutEnlargement: true })
    .toFile(originalPath)

  // Medium — 1000px wide
  await sharp(buffer)
    .resize(1000, undefined, { withoutEnlargement: true })
    .toFile(mediumPath)

  // Thumb — 400px wide
  await sharp(buffer)
    .resize(400, undefined, { withoutEnlargement: true })
    .toFile(thumbPath)

  const baseUrl = `/uploads/${module}/${id}`

  return {
    url: `${baseUrl}/${originalFilename}`,
    thumbUrl: `${baseUrl}/${thumbFilename}`,
    mediumUrl: `${baseUrl}/${mediumFilename}`,
  }
}

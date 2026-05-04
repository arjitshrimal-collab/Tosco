import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding Tosco International database...')

  // Admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Tosco@2024!', 12)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@toscointernational.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@toscointernational.com',
      password: hashedPassword,
      name: process.env.ADMIN_NAME || 'Tosco Admin',
    },
  })
  console.log('✓ Admin user:', admin.email)

  // Collections
  const collections = await Promise.all([
    prisma.collection.upsert({ where: { slug: 'eternal-rings' }, update: {}, create: { name: 'Eternal Rings', slug: 'eternal-rings', description: 'Diamonds and gemstones set in designs that endure through time.', order: 1, isActive: true } }),
    prisma.collection.upsert({ where: { slug: 'bridal-couture' }, update: {}, create: { name: 'Bridal Couture', slug: 'bridal-couture', description: 'Engagement rings and wedding bands for the most important days.', order: 2, isActive: true } }),
    prisma.collection.upsert({ where: { slug: 'statement-necklaces' }, update: {}, create: { name: 'Statement Necklaces', slug: 'statement-necklaces', description: 'Pieces that command presence — worn for the evenings worth remembering.', order: 3, isActive: true } }),
    prisma.collection.upsert({ where: { slug: 'heritage-earrings' }, update: {}, create: { name: 'Heritage Earrings', slug: 'heritage-earrings', description: 'From diamond studs to chandelier drops — refined elegance at every scale.', order: 4, isActive: true } }),
  ])
  console.log('✓ Collections:', collections.length)

  // Products
  const productData = [
    { name: 'The Stellara Solitaire', slug: 'stellara-solitaire', category: 'Rings', description: '<p>A 1.5-carat round brilliant diamond set in a hand-forged 18k yellow gold prong setting. The Stellara is the ring that needs no introduction.</p>', price: 12500, showPrice: true, specs: JSON.stringify({ metal: '18k Yellow Gold', stone: '1.5ct Round Brilliant Diamond (GIA Certified)', weight: '4.2g', dimensions: 'Band width: 2mm' }), isFeatured: true, inStock: true, collectionId: collections[0].id },
    { name: 'The Ophelia Band', slug: 'ophelia-band', category: 'Rings', description: '<p>A half-eternity diamond band in platinum. Fourteen round brilliant diamonds, channel-set to perfection. Worn alone or stacked with an engagement ring.</p>', price: 4800, showPrice: true, specs: JSON.stringify({ metal: 'Platinum 950', stone: '14 × 0.08ct Round Brilliant Diamonds, VS1 clarity', weight: '5.1g', dimensions: 'Band width: 3mm' }), isFeatured: true, inStock: true, collectionId: collections[0].id },
    { name: 'Bridal Pavé Set', slug: 'bridal-pave-set', category: 'Bridal', description: '<p>Our most-requested bridal set — a cushion-cut center stone surrounded by a halo of pavé diamonds, matched with a diamond-pavé wedding band.</p>', price: 18900, showPrice: false, specs: JSON.stringify({ metal: '18k White Gold', stone: '2.0ct Cushion Cut Diamond (GIA D/VS1)', weight: '7.8g', dimensions: 'Setting diameter: 10mm' }), isFeatured: true, inStock: true, collectionId: collections[1].id },
    { name: 'The Lumière Engagement Ring', slug: 'lumiere-engagement', category: 'Bridal', description: '<p>An oval-cut diamond in a delicate bezel setting, flanked by tapered baguettes. Modern geometry, timeless feeling.</p>', price: null, showPrice: false, specs: JSON.stringify({ metal: '18k Rose Gold', stone: 'Oval Cut Diamond (centre stone selected per client)', weight: '4.6g', dimensions: 'Available in sizes 4–9' }), isFeatured: true, inStock: true, collectionId: collections[1].id },
    { name: 'Rivière Diamond Necklace', slug: 'riviere-diamond-necklace', category: 'Necklaces', description: '<p>Twenty-three matched round brilliant diamonds set in a continuous platinum link chain. The classic rivière — worn by the discerning for over a century.</p>', price: 32000, showPrice: true, specs: JSON.stringify({ metal: 'Platinum 950', stone: '23 × 0.25ct Round Brilliant Diamonds, D-E/VVS', weight: '18g', dimensions: '16" length, adjustable to 18"' }), isFeatured: true, inStock: true, collectionId: collections[2].id },
    { name: 'The Tourmaline Drop', slug: 'tourmaline-drop-necklace', category: 'Necklaces', description: '<p>A 6.4-carat Paraíba tourmaline suspended from a delicate 18k gold chain. One of the rarest stones in the world, set with restraint.</p>', price: null, showPrice: false, specs: JSON.stringify({ metal: '18k Yellow Gold', stone: '6.4ct Paraíba Tourmaline (Mozambique origin)', weight: '8.4g', dimensions: 'Pendant: 18mm × 12mm, Chain: 18"' }), isFeatured: false, inStock: true, collectionId: collections[2].id },
    { name: 'Diamond Stud Earrings', slug: 'diamond-stud-earrings', category: 'Earrings', description: '<p>The earring that belongs in every collection. Two 0.50-carat round brilliants in four-prong platinum settings, secure with screw backs.</p>', price: 5200, showPrice: true, specs: JSON.stringify({ metal: 'Platinum 950', stone: '2 × 0.50ct Round Brilliant (GIA F/VS2)', weight: '1.8g per pair', dimensions: '5mm diameter' }), isFeatured: true, inStock: true, collectionId: collections[3].id },
    { name: 'The Maharani Chandelier', slug: 'maharani-chandelier-earrings', category: 'Earrings', description: '<p>Three tiers of graduated diamonds set in 22k gold. Inspired by the court jewelry of Rajasthan, designed for the modern woman.</p>', price: 9400, showPrice: true, specs: JSON.stringify({ metal: '22k Yellow Gold', stone: 'Rose-cut Diamonds, approximately 3.8ct total', weight: '12g per pair', dimensions: 'Drop length: 68mm' }), isFeatured: true, inStock: true, collectionId: collections[3].id },
    { name: 'The Shrimal Tennis Bracelet', slug: 'shrimal-tennis-bracelet', category: 'Bracelets', description: '<p>Our signature tennis bracelet — forty-two diamonds in a seamless platinum setting. Named for the family that believes in the enduring beauty of simplicity.</p>', price: 22000, showPrice: true, specs: JSON.stringify({ metal: 'Platinum 950', stone: '42 × 0.25ct Round Brilliant Diamonds, D-F/VS', weight: '24g', dimensions: '7" length, 4mm width' }), isFeatured: false, inStock: true, collectionId: null },
    { name: 'Emerald Cabochon Cuff', slug: 'emerald-cabochon-cuff', category: 'Bracelets', description: '<p>A statement cuff in 18k yellow gold set with a 14-carat Zambian emerald cabochon, flanked by rose-cut diamond pavé.</p>', price: null, showPrice: false, specs: JSON.stringify({ metal: '18k Yellow Gold', stone: '14ct Zambian Emerald Cabochon + Diamond Pavé', weight: '38g', dimensions: 'Cuff opening: 55mm × 50mm' }), isFeatured: false, inStock: true, collectionId: null },
    { name: 'Custom Commission', slug: 'custom-commission', category: 'Custom', description: '<p>Every great Tosco piece begins with a conversation. Bring us your vision — a stone you love, a design you have imagined — and we will create something that belongs to no one else.</p>', price: null, showPrice: false, specs: JSON.stringify({ metal: 'Your choice', stone: 'Your choice', weight: 'Varies', dimensions: 'Made to your specifications' }), isFeatured: false, inStock: true, collectionId: null },
    { name: 'Sapphire Trilogy Ring', slug: 'sapphire-trilogy-ring', category: 'Rings', description: '<p>A Kashmir sapphire flanked by two shield-cut diamonds. The trilogy setting — past, present, and future — in the most regal of blue stones.</p>', price: 28500, showPrice: true, specs: JSON.stringify({ metal: '18k White Gold', stone: '3.2ct Kashmir Sapphire (unheated) + 0.8ct Diamond flanks', weight: '6.1g', dimensions: 'Band width: 3.5mm' }), isFeatured: true, inStock: true, collectionId: collections[0].id },
  ]

  let productCount = 0
  for (const data of productData) {
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    })
    productCount++
  }
  console.log('✓ Products:', productCount)

  // Testimonials
  const testimonialData = [
    { author: 'Catherine V.', location: 'New York, NY', content: 'Tosco created our engagement ring and wedding bands. The experience was personal, unhurried, and genuinely joyful. Three years later, the ring still stops people on the street.', rating: 5, isActive: true, order: 1 },
    { author: 'James & Priya M.', location: 'London, UK', content: 'We came to Tosco with a very particular vision. Asit listened for an hour before he said a single word about design. The result was better than anything we could have imagined.', rating: 5, isActive: true, order: 2 },
    { author: 'Sophia R.', location: 'Miami, FL', content: 'I have purchased from several fine jewelers over the years. None compare to the caliber of craftsmanship or the depth of knowledge you find at Tosco. My Maharani earrings are extraordinary.', rating: 5, isActive: true, order: 3 },
    { author: 'The Nakamura Family', location: 'Tokyo, Japan', content: 'For three generations our family has marked its milestones with Tosco pieces. The Shrimals have become part of our family story in a way that goes far beyond jewelry.', rating: 5, isActive: true, order: 4 },
  ]

  for (const t of testimonialData) {
    const existing = await prisma.testimonial.findFirst({ where: { author: t.author } })
    if (!existing) await prisma.testimonial.create({ data: t })
  }
  console.log('✓ Testimonials:', testimonialData.length)

  // Site settings
  const defaultSettings = [
    ['heroTagline', 'Where Every Piece Tells a Story'],
    ['heroSubtext', "Handcrafted fine jewelry for life's most precious moments"],
    ['storyHeading', 'A Story Rooted in Craft and Care'],
    ['storyBody', 'Tosco International Inc. was born from a shared dream — that of Asit and Aditi Shrimal, who believed that the finest jewelry is not merely worn, but felt.'],
    ['address', '123 Jewelry District, New York, NY 10036'],
    ['contactEmail', 'hello@toscointernational.com'],
    ['phone', '+1 (212) 555-0180'],
    ['hours', 'Monday – Saturday, 10am – 7pm ET'],
    ['instagram', '#'],
    ['facebook', '#'],
    ['pinterest', '#'],
  ]

  for (const [key, value] of defaultSettings) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } })
  }
  console.log('✓ Site settings:', defaultSettings.length)

  // Static pages
  const pages = [
    { slug: 'about', title: 'About Tosco International', content: '<p>Tosco International Inc. was founded by Asit and Aditi Shrimal with a singular belief: that fine jewelry should be personal, enduring, and made without compromise.</p>' },
    { slug: 'privacy', title: 'Privacy Policy', content: '<p>See /privacy for the full policy.</p>' },
    { slug: 'terms', title: 'Terms of Service', content: '<p>See /terms for the full terms.</p>' },
    { slug: 'shipping-returns', title: 'Shipping & Returns', content: '<p>See /shipping-returns for full details.</p>' },
  ]
  for (const page of pages) {
    await prisma.page.upsert({ where: { slug: page.slug }, update: {}, create: page })
  }
  console.log('✓ Pages:', pages.length)

  console.log('\n✅ Seed complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Admin login: ${process.env.ADMIN_EMAIL || 'admin@toscointernational.com'}`)
  console.log(`Password:    ${process.env.ADMIN_PASSWORD || 'Tosco@2024!'}`)
  console.log('Admin URL:   http://localhost:3000/admin')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

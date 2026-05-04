import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/home/HeroSection'
import CollectionsStrip from '@/components/home/CollectionsStrip'
import LegacySection from '@/components/home/LegacySection'
import BestsellersGrid from '@/components/home/BestsellersGrid'
import TrustSignals from '@/components/home/TrustSignals'
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel'
import NewsletterSection from '@/components/home/NewsletterSection'

async function getHomeData() {
  try {
    const [featuredProducts, activeCollections, activeTestimonials, siteSettings] =
      await Promise.all([
        prisma.product
          .findMany({
            where: { isFeatured: true },
            take: 8,
            include: {
              images: {
                orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
              },
            },
            orderBy: { createdAt: 'desc' },
          })
          .catch(() => []),

        prisma.collection
          .findMany({
            where: { isActive: true },
            take: 4,
            orderBy: { order: 'asc' },
          })
          .catch(() => []),

        prisma.testimonial
          .findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
          })
          .catch(() => []),

        prisma.siteSetting
          .findMany({
            where: {
              key: { in: ['heroHeading', 'heroSubheading', 'heroImage'] },
            },
          })
          .catch(() => []),
      ])

    // Build settings map
    const settings = Object.fromEntries(
      siteSettings.map((s: { key: string; value: string }) => [s.key, s.value])
    )

    return {
      featuredProducts,
      activeCollections,
      activeTestimonials,
      heroHeading: settings.heroHeading as string | undefined,
      heroSubheading: settings.heroSubheading as string | undefined,
      heroImage: settings.heroImage as string | undefined,
    }
  } catch {
    // If Prisma or DB is unavailable, return empty state gracefully
    return {
      featuredProducts: [],
      activeCollections: [],
      activeTestimonials: [],
      heroHeading: undefined,
      heroSubheading: undefined,
      heroImage: undefined,
    }
  }
}

export default async function HomePage() {
  const { featuredProducts, activeCollections, activeTestimonials, heroHeading, heroSubheading, heroImage } =
    await getHomeData()

  return (
    <main>
      {/* Hero */}
      <HeroSection
        heroImage={heroImage}
        heroHeading={heroHeading}
        heroSubheading={heroSubheading}
      />

      {/* Collections strip */}
      <CollectionsStrip collections={activeCollections} />

      {/* Trust signals */}
      <TrustSignals />

      {/* Legacy / about */}
      <LegacySection />

      {/* Bestsellers / featured products */}
      <BestsellersGrid products={featuredProducts} />

      {/* Testimonials */}
      <TestimonialsCarousel testimonials={activeTestimonials} />

      {/* Newsletter */}
      <NewsletterSection />
    </main>
  )
}

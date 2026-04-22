import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import Hero from '@/shared/components/layout/Hero'
import PromotionalBanner from '@/shared/components/sections/PromotionalBanner'

export const metadata: Metadata = {
  title: 'ImoPanorama Madagascar - Acheter, louer et construire sereinement',
  description: 'Trouvez un bien à Madagascar avec un accompagnement humain : terrains, maisons, appartements, locaux commerciaux et projets de construction avec BatiPanorama.',
}

// Dynamic imports for below-the-fold sections
// This reduces initial bundle size and improves First Contentful Paint
const PropertySection = dynamic(() => import('@/shared/components/sections/PropertySection'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

const StatisticsSection = dynamic(() => import('@/shared/components/sections/StatisticsSection'), {
  loading: () => <div className="h-64 bg-gray-50 animate-pulse" />
})

const AdvantagesSection = dynamic(() => import('@/shared/components/sections/AdvantagesSection'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

const BatiPanoramaSection = dynamic(() => import('@/shared/components/sections/BatiPanoramaSection'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

const NewsSection = dynamic(() => import('@/shared/components/sections/NewsSection'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

const FaqSection = dynamic(() => import('@/shared/components/sections/FaqSection'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

export default function Home() {
  return (
    <>
    <div className="relative min-h-screen bg-linear-to-br from-primary-50 via-white to-accent-50">
      {/* Animated background elements for the entire page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-6000"></div>
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        <PromotionalBanner />
        <Hero />
        <div className="space-y-0">
          <PropertySection />
          <StatisticsSection />
          <AdvantagesSection />
          <BatiPanoramaSection />
          <NewsSection />
          <FaqSection />
        </div>
      </div>
    </div>
</>
  )
}

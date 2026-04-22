import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/shared/components/layout/Header'
import Footer from '@/shared/components/layout/Footer'
import CookieBanner from '@/shared/components/layout/CookieBanner'
import ClientProviders from './ClientProviders'

export const metadata: Metadata = {
  title: 'ImoPanorama Madagascar - Vente & Location de Propriétés',
  description: 'Agence immobilière spécialisée à Madagascar. Découvrez nos terrains, villas, appartements et locaux commerciaux. BatiPanorama pour vos projets de construction.',
  keywords: ['immobilier', 'propriété', 'terrain', 'villa', 'appartement', 'Madagascar', 'vente', 'location', 'construction', 'BatiPanorama'],
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientProviders>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieBanner />
    </ClientProviders>
  )
}

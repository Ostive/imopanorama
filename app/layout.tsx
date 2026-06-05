import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { ThemeProvider } from '@/shared/theme/ThemeContext'
import { FavoritesProvider } from '@/features/favorites/context/FavoritesContext'
import { ContactsProvider } from '@/features/contacts/context/ContactsContext'
import { ReactQueryProvider } from '@/shared/providers/react-query'
import CookieConsentScripts from '@/shared/components/layout/CookieConsentScripts'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ImoPanorama Madagascar - Vente & Location de Propriétés',
    template: '%s | ImoPanorama Madagascar',
  },
  description:
    'Agence immobilière spécialisée dans la vente de propriétés à Madagascar. Découvrez nos terrains, villas et appartements disponibles et notre partenaire BatiPanorama pour la construction.',
  keywords: ['immobilier', 'propriété', 'terrain', 'villa', 'appartement', 'Madagascar', 'vente', 'construction', 'BatiPanorama', 'Antananarivo'],
  authors: [{ name: 'ImoPanorama' }],
  creator: 'ImoPanorama',
  publisher: 'ImoPanorama',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://imopanorama.mg'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ImoPanorama Madagascar - Vente & Location de Propriétés',
    description: 'Agence immobilière spécialisée dans la vente de propriétés à Madagascar. Découvrez nos biens disponibles.',
    url: 'https://imopanorama.mg',
    siteName: 'ImoPanorama Madagascar',
    locale: 'fr_MG',
    type: 'website',
    images: [
      {
        url: '/images/social/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ImoPanorama Madagascar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImoPanorama Madagascar - Vente & Location de Propriétés',
    description: 'Agence immobilière spécialisée dans la vente de propriétés à Madagascar.',
    images: ['/images/social/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={poppins.variable}>
        <ReactQueryProvider>
          <AuthProvider>
            <FavoritesProvider>
              <ContactsProvider>
                <ThemeProvider>
                  {children}
                  <CookieConsentScripts />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        borderRadius: '12px',
                        background: '#333',
                        color: '#fff',
                        fontSize: '14px',
                      },
                    }}
                  />
                </ThemeProvider>
              </ContactsProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}

'use client'

import { CompareProvider } from '@/features/properties/context/CompareContext'
import { CompareBar } from '@/features/properties/components/CompareBar'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <CompareBar />
    </CompareProvider>
  )
}

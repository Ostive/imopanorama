'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PropertyForm } from '@/features/properties/components/form/PropertyForm'

function NewPropertyPageInner() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') || ''
  return <PropertyForm mode="create" initialType={initialType} />
}

export default function NewPropertyPage() {
  return (
    <Suspense>
      <NewPropertyPageInner />
    </Suspense>
  )
}

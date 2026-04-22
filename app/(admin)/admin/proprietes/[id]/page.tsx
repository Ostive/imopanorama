'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import { PropertyDetailSkeleton } from '@/shared/components/loading'

export default function ViewPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params?.id as string

  useEffect(() => {
    if (propertyId) {
      router.replace(`/proprietes/${propertyId}`)
    }
  }, [propertyId, router])

  return (
    <ProtectedRoute>
      <PropertyDetailSkeleton />
    </ProtectedRoute>
  )
}
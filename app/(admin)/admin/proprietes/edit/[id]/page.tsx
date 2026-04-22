'use client'

import { useParams } from 'next/navigation'
import { PropertyForm } from '@/features/properties/components/form/PropertyForm'

export default function EditPropertyPage() {
  const params = useParams()
  const propertyId = params?.id as string
  return <PropertyForm mode="edit" propertyId={propertyId} />
}

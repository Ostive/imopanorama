'use client'

import { useParams } from 'next/navigation'
import ServiceForm from '@/features/batipanorama/components/form/ServiceForm'

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>()
  return <ServiceForm mode="edit" serviceId={id} />
}

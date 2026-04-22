'use client'

import { useParams } from 'next/navigation'
import ProcessStepForm from '@/features/batipanorama/components/form/ProcessStepForm'

export default function EditProcessStepPage() {
  const { id } = useParams<{ id: string }>()
  return <ProcessStepForm mode="edit" stepId={id} />
}

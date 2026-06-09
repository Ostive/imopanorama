import { redirect } from 'next/navigation'

export default async function ViewPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/proprietes/${id}`)
}

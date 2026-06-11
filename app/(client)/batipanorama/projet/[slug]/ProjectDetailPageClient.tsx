'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowsPointingOutIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  HomeModernIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import type { ComponentType } from 'react'
import type { Project } from '@/features/batipanorama/types/batipanorama.types'

async function fetchProject(id: string): Promise<Project> {
  const response = await fetch(`/api/bati-projects/${encodeURIComponent(id)}`)
  if (!response.ok) throw new Error('Projet introuvable')
  const data = await response.json()
  if (!data.success || !data.project) throw new Error('Projet introuvable')
  return data.project
}

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>()
  const id = params?.slug

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['bati-project-detail', id],
    queryFn: () => fetchProject(id),
    enabled: Boolean(id),
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-12 animate-pulse rounded bg-muted" />
              <div className="h-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (isError || !project) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-600">BatiPanorama</p>
          <h1 className="mt-4 text-4xl font-black text-foreground">Projet introuvable</h1>
          <p className="mt-4 text-muted-foreground">Ce projet n'est plus disponible.</p>
          <Link href="/batipanorama/projets" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700">
            <ArrowLeftIcon className="h-4 w-4" />
            Retour aux projets
          </Link>
        </div>
      </main>
    )
  }

  const images = [project.coverImage, ...(project.images || [])].filter(Boolean) as string[]
  const heroImage = images[0] || '/images/batipanorama/project-placeholder.jpg'

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Link href="/batipanorama/projets" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
            <ArrowLeftIcon className="h-4 w-4" />
            Projets BatiPanorama
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-xl">
              <Image
                src={heroImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-700">
                  {project.category}
                </span>
                {project.status && (
                  <span className="rounded-lg bg-secondary-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-700">
                    {project.status === 'COMPLETED' ? 'Livre' : project.status === 'IN_PROGRESS' ? 'En cours' : 'Planifie'}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight text-foreground md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <InfoItem icon={MapPinIcon} label="Localisation" value={project.location || 'Sainte-Marie'} />
                {project.surface && <InfoItem icon={ArrowsPointingOutIcon} label="Surface" value={`${project.surface} m2`} />}
                {project.duration && <InfoItem icon={CalendarIcon} label="Duree" value={project.duration} />}
                {project.year && <InfoItem icon={HomeModernIcon} label="Annee" value={String(project.year)} />}
              </div>

              <Link href="/batipanorama/contact" className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-700">
                Demander un devis a Sainte-Marie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {(project.features?.length || project.tags?.length || images.length > 1) && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          {project.features?.length ? (
            <div className="mb-10">
              <h2 className="text-2xl font-black text-foreground">Caracteristiques</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {project.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-secondary-600" />
                    <span className="text-sm font-medium text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {project.tags?.length ? (
            <div className="mb-10 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {images.length > 1 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.slice(1).map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  <Image src={image} alt={`${project.title} ${index + 2}`} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </section>
      )}
    </main>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  )
}

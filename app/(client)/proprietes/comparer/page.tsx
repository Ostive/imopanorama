'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
import { Property, PROPERTY_TYPE_LABELS, PROPERTY_CONDITION_LABELS } from '@/features/properties/types'
import { formatPrice } from '@/shared/utils'
import { useImageFallback } from '@/shared/hooks/useImageFallback'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  ArrowsPointingOutIcon,
  HomeIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

// ─── helpers ────────────────────────────────────────────────────────────────

function bestValue(values: (number | undefined | null)[], propIdx: number) {
  const nums = values.map(v => (typeof v === 'number' ? v : null))
  const max = Math.max(...nums.filter((n): n is number => n !== null))
  return nums[propIdx] === max && max > 0
}

function lowestPrice(values: (number | undefined | null)[], propIdx: number) {
  const nums = values.map(v => (typeof v === 'number' ? v : null))
  const min = Math.min(...nums.filter((n): n is number => n !== null))
  return nums[propIdx] === min && min >= 0
}

// ─── row types ──────────────────────────────────────────────────────────────

type RowDef =
  | { type: 'section'; label: string }
  | { type: 'text'; label: string; render: (p: Property) => string | null }
  | { type: 'number'; label: string; getValue: (p: Property) => number | undefined | null; format: (v: number, p: Property) => string; higherIsBetter?: boolean }
  | { type: 'bool'; label: string; getValue: (p: Property) => boolean }
  | { type: 'list'; label: string; getValue: (p: Property) => string[] }

const ROWS: RowDef[] = [
  { type: 'section', label: 'Informations générales' },
  { type: 'text', label: 'Type de bien', render: p => PROPERTY_TYPE_LABELS[p.propertyType] || p.propertyType },
  { type: 'text', label: 'Type de transaction', render: p => p.transactionType === 'SALE' ? 'Vente' : p.transactionType === 'RENT' ? 'Location' : 'Location saisonnière' },
  { type: 'text', label: 'Localisation', render: p => p.city || p.location },
  { type: 'text', label: 'Adresse', render: p => p.address || null },
  { type: 'text', label: 'État', render: p => p.condition ? (PROPERTY_CONDITION_LABELS?.[p.condition] ?? p.condition) : null },
  { type: 'text', label: 'Référence', render: p => p.reference || null },
  { type: 'section', label: 'Prix' },
  { type: 'number', label: 'Prix', getValue: p => p.price, format: (v, p) => formatPrice(v, p.currency, p.country), higherIsBetter: false },
  { type: 'number', label: 'Prix / m²', getValue: p => p.pricePerM2 ?? undefined, format: (v, p) => `${formatPrice(Math.round(v), p.currency, p.country)}/m²`, higherIsBetter: false },
  { type: 'section', label: 'Surfaces' },
  { type: 'number', label: 'Surface totale', getValue: p => p.totalSize, format: v => `${v.toLocaleString('fr-FR')} m²`, higherIsBetter: true },
  { type: 'number', label: 'Surface habitable', getValue: p => p.livingSize ?? undefined, format: v => `${v.toLocaleString('fr-FR')} m²`, higherIsBetter: true },
  { type: 'number', label: 'Surface terrain', getValue: p => p.landSize ?? undefined, format: v => `${v.toLocaleString('fr-FR')} m²`, higherIsBetter: true },
  { type: 'section', label: 'Pièces' },
  { type: 'number', label: 'Chambres', getValue: p => p.bedrooms ?? undefined, format: v => String(v), higherIsBetter: true },
  { type: 'number', label: 'Salles de bain', getValue: p => p.bathrooms ?? undefined, format: v => String(v), higherIsBetter: true },
  { type: 'number', label: 'Pièces totales', getValue: p => p.rooms ?? undefined, format: v => String(v), higherIsBetter: true },
  { type: 'number', label: 'Étage', getValue: p => p.floor ?? undefined, format: v => String(v) },
  { type: 'number', label: 'Nombre d\'étages', getValue: p => p.floors ?? undefined, format: v => String(v) },
  { type: 'number', label: 'Année de construction', getValue: p => p.yearBuilt ?? undefined, format: v => String(v) },
  { type: 'section', label: 'Médias' },
  { type: 'bool', label: 'Visite virtuelle 360°', getValue: p => !!p.virtualTour },
  { type: 'bool', label: 'Vidéo de présentation', getValue: p => !!p.videoUrl },
  { type: 'section', label: 'Caractéristiques' },
  { type: 'list', label: 'Équipements', getValue: p => p.amenities || [] },
  { type: 'list', label: 'Caractéristiques', getValue: p => p.features || [] },
]

// ─── cell component ──────────────────────────────────────────────────────────

function Cell({ row, property, properties, propIdx }: { row: RowDef; property: Property; properties: Property[]; propIdx: number }) {
  if (row.type === 'section') return null

  if (row.type === 'text') {
    const val = row.render(property)
    if (!val) return <span className="text-gray-400 text-sm">—</span>
    return <span className="text-sm text-foreground">{val}</span>
  }

  if (row.type === 'number') {
    const val = row.getValue(property)
    if (val == null) return <span className="text-gray-400 text-sm">—</span>
    const allVals = properties.map(row.getValue)
    const isBest = row.higherIsBetter === true
      ? bestValue(allVals, propIdx)
      : row.higherIsBetter === false
        ? lowestPrice(allVals, propIdx)
        : false
    return (
      <span className={`text-sm font-semibold ${isBest ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
        {row.format(val, property)}
        {isBest && properties.filter(p => row.getValue(p) != null).length > 1 && (
          <span className="ml-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full">✓</span>
        )}
      </span>
    )
  }

  if (row.type === 'bool') {
    const val = row.getValue(property)
    return val
      ? <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
      : <XCircleIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
  }

  if (row.type === 'list') {
    const items = row.getValue(property)
    if (!items.length) return <span className="text-gray-400 text-sm">—</span>
    return (
      <div className="flex flex-wrap gap-1">
        {items.slice(0, 6).map((item, i) => (
          <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-foreground px-2 py-0.5 rounded-full">{item}</span>
        ))}
        {items.length > 6 && <span className="text-xs text-primary-600 font-medium">+{items.length - 6}</span>}
      </div>
    )
  }

  return null
}

// ─── inner (uses useSearchParams) ────────────────────────────────────────────

function ComparerInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ids = (searchParams.get('ids') || '').split(',').map(id => id.trim()).filter(Boolean).slice(0, 4)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { safeImages } = useImageFallback()

  const removeProperty = (propertyId: string) => {
    const newIds = properties.filter(p => p.id !== propertyId).map(p => p.id)
    if (newIds.length === 0) {
      router.push('/proprietes')
    } else {
      router.push(`/proprietes/comparer?ids=${newIds.join(',')}`)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    async function fetchComparedProperties() {
      if (!ids.length) {
        setProperties([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `/api/properties?ids=${encodeURIComponent(ids.join(','))}&limit=${ids.length}`,
          { signal: controller.signal }
        )
        const result = await response.json()
        setProperties(result.success ? result.data as Property[] : [])
      } catch (error) {
        if (!controller.signal.aborted) setProperties([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchComparedProperties()
    return () => controller.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const colWidth = properties.length <= 2 ? 'w-1/2' : properties.length === 3 ? 'w-1/3' : 'w-1/4'

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
          <ChevronRightIcon className="w-4 h-4" />
          <Link href="/proprietes" className="hover:text-primary-600 transition-colors">Propriétés</Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-foreground font-semibold">Comparateur</span>
        </nav>

        {/* Header */}
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <ArrowsRightLeftIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-black text-foreground">Comparateur de propriétés</h1>
          </div>
          <p className="text-muted-foreground">Comparez jusqu'à 4 propriétés côte à côte</p>
        </m.div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Aucune propriété à comparer</h2>
            <p className="text-gray-500 mb-6">Ajoutez des propriétés à comparer depuis le catalogue</p>
            <Button asChild>
              <Link href="/proprietes">Voir les propriétés</Link>
            </Button>
          </div>
        )}

        {!loading && properties.length > 0 && (
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {/* Comparison grid */}
            <div className="overflow-x-auto rounded-2xl border border-border shadow-xl bg-card">
              <div className="min-w-120">

                {/* Property cards header */}
                <div
                  className="grid sticky top-0 z-20 bg-card border-b-2 border-border"
                  style={{ gridTemplateColumns: `repeat(${properties.length}, 1fr)` }}
                >
                  {properties.map(property => {
                    const imgs = safeImages(property.images || [])
                    return (
                      <div key={property.id} className="relative group border-r border-border last:border-r-0">
                        <button type="button"
                          onClick={() => removeProperty(property.id)}
                          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-600 text-white rounded-full transition-colors z-10 backdrop-blur-sm"
                          title="Retirer de la comparaison"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                        <Link href={`/proprietes/${property.id}`} className="block">
                          <div className="relative w-full aspect-video overflow-hidden bg-muted">
                            <Image
                              src={imgs[0]}
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="300px"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute top-2 left-2">
                              <span className="text-xs font-semibold bg-white/90 text-gray-800 px-2 py-0.5 rounded-full">
                                {PROPERTY_TYPE_LABELS[property.propertyType]}
                              </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-sm font-bold text-white line-clamp-1">{property.title}</p>
                              <p className="text-base font-black text-primary-300">{formatPrice(property.price)}</p>
                            </div>
                          </div>
                        </Link>
                        <div className="px-3 py-2 flex items-center justify-between gap-1 text-xs text-muted-foreground bg-muted/50">
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3 shrink-0" />
                            {property.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <ArrowsPointingOutIcon className="w-3 h-3 shrink-0" />
                            {property.totalSize} m²
                          </span>
                          {property.bedrooms && (
                            <span className="flex items-center gap-1">
                              <HomeIcon className="w-3 h-3 shrink-0" />
                              {property.bedrooms} ch.
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Data rows */}
                {ROWS.map((row, rowIdx) => {
                  if (row.type === 'section') {
                    return (
                      <div key={rowIdx} className="px-4 py-2.5 bg-muted/40 border-b border-border">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {row.label}
                        </span>
                      </div>
                    )
                  }
                  return (
                    <div
                      key={rowIdx}
                      className="grid border-b border-border hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                      style={{ gridTemplateColumns: `180px repeat(${properties.length}, 1fr)` }}
                    >
                      <div className="p-4 text-sm text-muted-foreground font-medium border-r border-border flex items-center">
                        {row.label}
                      </div>
                      {properties.map((property, propIdx) => (
                        <div key={property.id} className="p-4 text-center border-r border-border last:border-r-0 flex items-center justify-center">
                          <Cell row={row} property={property} properties={properties} propIdx={propIdx} />
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/proprietes">← Retour au catalogue</Link>
              </Button>
              <Button asChild>
                <Link href="/proprietes">Ajouter une propriété</Link>
              </Button>
            </div>
          </m.div>
        )}
      </div>
    </div>
  )
}

// ─── page export (Suspense required for useSearchParams) ─────────────────────

export default function ComparerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-background to-muted/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-muted rounded-xl w-64" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2].map(i => <div key={i} className="h-64 bg-muted rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    }>
      <ComparerInner />
    </Suspense>
  )
}

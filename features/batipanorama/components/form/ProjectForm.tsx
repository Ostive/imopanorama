'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { m } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  TagIcon,
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowsPointingOutIcon,
  ClockIcon,
  UserIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { Switch } from '@/shared/components/ui/switch'
import { Progress } from '@/shared/components/ui/progress'
import { Badge } from '@/shared/components/ui/badge'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import { BatiProjectFormDataSchema } from '@/features/batipanorama/schemas/batipanorama.schema'
import { getErrorMessage, readApiError } from '@/shared/utils/apiErrors'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectFormProps {
  mode: 'create' | 'edit'
  projectId?: string
}

// ─── Labels des champs pour les messages d'erreur ─────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  title: 'Titre',
  description: 'Description',
  location: 'Localisation',
  category: 'Catégorie',
  images: 'Images',
  coverImage: 'Image de couverture',
  status: 'Statut',
  surface: 'Surface',
  duration: 'Durée',
  budget: 'Budget',
  client: 'Client',
  year: 'Année',
}

// ─── Étapes de complétion ─────────────────────────────────────────────────────

const COMPLETION_STEPS = [
  { key: 'title',       label: 'Titre',                icon: BuildingOffice2Icon },
  { key: 'description', label: 'Description',          icon: BuildingOffice2Icon },
  { key: 'location',    label: 'Localisation',         icon: MapPinIcon },
  { key: 'category',    label: 'Catégorie',            icon: TagIcon },
  { key: 'images',      label: 'Au moins 1 image',     icon: PhotoIcon },
  { key: 'coverImage',  label: 'Image de couverture',  icon: PhotoIcon },
]

// ─── Formulaire par défaut ────────────────────────────────────────────────────

const DEFAULT_FORM = {
  title: '',
  description: '',
  location: '',
  category: '',
  surface: '',
  duration: '',
  budget: '',
  coverImage: '',
  images: [] as string[],
  status: 'COMPLETED' as 'IN_PROGRESS' | 'COMPLETED' | 'PLANNED',
  isPublished: true,
  order: '0',
  client: '',
  year: new Date().getFullYear().toString(),
  tags: [] as string[],
  features: [] as string[],
}

// ─── Helper erreur ────────────────────────────────────────────────────────────

function FieldError({ name, errors }: { name: string; errors: Record<string, string> }) {
  if (!errors[name]) return null
  return <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ProjectForm({ mode, projectId }: ProjectFormProps) {
  const router = useRouter()
  const isEdit = mode === 'edit'

  const [isLoading, setIsLoading]     = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData]       = useState(DEFAULT_FORM)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [newTag, setNewTag]           = useState('')
  const [newFeature, setNewFeature]   = useState('')

  // ─── Chargement (mode edit) ───────────────────────────────────────────────

  const fetchProject = useCallback(async () => {
    if (!projectId) return
    try {
      const res = await fetch(`/api/bati-projects/${projectId}`)
      const data = await res.json()
      if (data.success) {
        const p = data.project
        setFormData({
          title:       p.title || '',
          description: p.description || '',
          location:    p.location || '',
          category:    p.category || '',
          surface:     p.surface?.toString() || '',
          duration:    p.duration || '',
          budget:      p.budget || '',
          coverImage:  p.coverImage || '',
          images:      p.images || [],
          status:      p.status || 'COMPLETED',
          isPublished: p.isPublished ?? true,
          order:       p.order?.toString() || '0',
          client:      p.client || '',
          year:        p.year?.toString() || new Date().getFullYear().toString(),
          tags:        p.tags || [],
          features:    p.features || [],
        })
      }
    } catch {
      toast.error('Erreur lors du chargement du projet')
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => { fetchProject() }, [fetchProject])

  // ─── Progression automatique ──────────────────────────────────────────────

  const completedSteps = useMemo(() => {
    return COMPLETION_STEPS.filter(({ key }) => {
      if (key === 'images')     return formData.images.length > 0
      if (key === 'coverImage') return formData.coverImage.trim() !== ''
      return (formData as any)[key]?.toString().trim() !== ''
    }).length
  }, [formData])

  const completionPct = Math.round((completedSteps / COMPLETION_STEPS.length) * 100)
  const isComplete    = completedSteps === COMPLETION_STEPS.length

  // ─── Soumission avec validation Zod ──────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    // Validation Zod
    const result = BatiProjectFormDataSchema.safeParse(formData)
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach(err => {
        errors[err.path.join('.')] = err.message
      })
      setFieldErrors(errors)
      const messages = result.error.issues.map(err => {
        const label = FIELD_LABELS[String(err.path[0])] || String(err.path[0])
        return `${label} : ${err.message}`
      })
      toast.error(messages[0], { duration: 5000 })
      return
    }

    setIsSubmitting(true)
    try {
      const url    = isEdit ? `/api/bati-projects/${projectId}` : '/api/bati-projects'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })
      if (res.ok) {
        toast.success(isEdit ? 'Projet modifié avec succès' : 'Projet créé avec succès')
        router.push('/admin/batipanorama/projects')
      } else {
        const apiError = await readApiError(res, isEdit ? 'Erreur lors de la modification du projet' : 'Erreur lors de la creation du projet')
        setFieldErrors(apiError.fieldErrors)
        toast.error(apiError.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    // Effacer l'erreur du champ modifié
    if (fieldErrors[name]) setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const addImageUrl = () => {
    const url = window.prompt("Entrez l'URL de l'image :")
    if (url?.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url.trim()] }))
    }
  }

  const removeImage = (index: number) => {
    const removed = formData.images[index]
    setFormData(prev => ({
      ...prev,
      images:     prev.images.filter((_, i) => i !== index),
      coverImage: prev.coverImage === removed ? '' : prev.coverImage,
    }))
  }

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature('')
    }
  }

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </ProtectedRoute>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute requiredRole={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href="/admin/batipanorama/projects"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center mr-2 group-hover:border-primary/50 group-hover:text-primary transition-all shadow-sm">
                <ArrowLeftIcon className="h-4 w-4" />
              </div>
              Retour aux projets
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/20">
                  <BuildingOffice2Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {isEdit ? 'Modifier le Projet' : 'Nouveau Projet'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {isEdit ? (formData.title || 'Chargement…') : 'Créez un nouveau projet BatiPanorama'}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-card py-1.5 px-4 rounded-full border border-border shadow-sm">
                <span className={`w-2 h-2 rounded-full ${isSubmitting ? 'bg-yellow-400 animate-pulse' : isComplete ? 'bg-green-500' : 'bg-orange-400'}`} />
                {isSubmitting ? 'Enregistrement…' : isEdit ? 'Mode édition' : 'Mode création'}
              </div>
            </div>
          </m.div>

          {/* Form — 12-col grid */}
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">

            {/* ── LEFT (9 cols) ──────────────────────────────────── */}
            <div className="lg:col-span-9 space-y-8">

              {/* Informations de base */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                        <BuildingOffice2Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <CardTitle>Informations de base</CardTitle>
                        <CardDescription>Les détails essentiels du projet</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">

                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du projet *</Label>
                      <Input
                        id="title" name="title" value={formData.title} onChange={handleChange} required
                        placeholder="Villa moderne à Ivato"
                        className={fieldErrors.title ? 'border-red-500' : ''}
                      />
                      <FieldError name="title" errors={fieldErrors} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description" name="description" value={formData.description} onChange={handleChange} required rows={4}
                        placeholder="Description détaillée du projet…"
                        className={fieldErrors.description ? 'border-red-500' : ''}
                      />
                      <div className="flex justify-between">
                        <FieldError name="description" errors={fieldErrors} />
                        <p className="text-xs text-muted-foreground">{formData.description.length} / 10 min.</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-1.5">
                          <MapPinIcon className="w-4 h-4 text-gray-400" /> Localisation *
                        </Label>
                        <Input
                          id="location" name="location" value={formData.location} onChange={handleChange} required
                          placeholder="Ivato, Antananarivo"
                          className={fieldErrors.location ? 'border-red-500' : ''}
                        />
                        <FieldError name="location" errors={fieldErrors} />
                      </div>
                      <div className="space-y-2">
                        <Label>Catégorie *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(v) => {
                            setFormData(prev => ({ ...prev, category: v }))
                            if (fieldErrors.category) setFieldErrors(prev => { const n = { ...prev }; delete n.category; return n })
                          }}
                          required
                        >
                          <SelectTrigger className={`w-full ${fieldErrors.category ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Résidentiel">Résidentiel</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                              <SelectItem value="Industriel">Industriel</SelectItem>
                              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="Rénovation">Rénovation</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldError name="category" errors={fieldErrors} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="surface" className="flex items-center gap-1.5">
                          <ArrowsPointingOutIcon className="w-4 h-4 text-gray-400" /> Surface (m²)
                        </Label>
                        <Input id="surface" name="surface" type="number" value={formData.surface} onChange={handleChange} placeholder="250" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="flex items-center gap-1.5">
                          <ClockIcon className="w-4 h-4 text-gray-400" /> Durée
                        </Label>
                        <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="6 mois" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="flex items-center gap-1.5">
                          <CurrencyDollarIcon className="w-4 h-4 text-gray-400" /> Budget
                        </Label>
                        <Input id="budget" name="budget" value={formData.budget} onChange={handleChange} placeholder="150 000 000 Ar" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="client" className="flex items-center gap-1.5">
                          <UserIcon className="w-4 h-4 text-gray-400" /> Client
                        </Label>
                        <Input id="client" name="client" value={formData.client} onChange={handleChange} placeholder="Nom du client" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year" className="flex items-center gap-1.5">
                          <CalendarIcon className="w-4 h-4 text-gray-400" /> Année
                        </Label>
                        <Input id="year" name="year" type="number" value={formData.year} onChange={handleChange} placeholder="2025" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </m.div>

              {/* Images */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                          <PhotoIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <CardTitle>Images du projet *</CardTitle>
                          <CardDescription>
                            {fieldErrors.images || fieldErrors.coverImage
                              ? <span className="text-red-500">{fieldErrors.images || fieldErrors.coverImage}</span>
                              : 'Cliquez sur une image pour la définir comme couverture'}
                          </CardDescription>
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="gap-1.5">
                        <PlusIcon className="w-4 h-4" /> Ajouter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {formData.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((img, index) => (
                          <div
                            key={index}
                            role="button"
                            tabIndex={0}
                            onClick={() => setFormData(prev => ({ ...prev, coverImage: img }))}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFormData(prev => ({ ...prev, coverImage: img })); } }}
                            className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                              formData.coverImage === img
                                ? 'border-primary-500 ring-2 ring-primary-300'
                                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <Image src={img} alt={`Image ${index + 1}`} width={200} height={128} className="w-full h-32 object-cover" />
                            {formData.coverImage === img && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-md">
                                Couverture
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(index) }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={addImageUrl}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addImageUrl(); } }}
                        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                          fieldErrors.images
                            ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10'
                            : 'border-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/30 dark:hover:bg-primary-900/10'
                        }`}
                      >
                        <PhotoIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Cliquez pour ajouter une image</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </m.div>

              {/* Tags & Features */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                        <TagIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <CardTitle>Tags & Caractéristiques</CardTitle>
                        <CardDescription>Mots-clés et points forts du projet</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 grid md:grid-cols-2 gap-8">

                    {/* Tags */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-1.5">
                        <TagIcon className="w-4 h-4 text-gray-400" /> Tags
                      </Label>
                      <div className="flex flex-wrap gap-2 min-h-[36px]">
                        {formData.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                            {tag}
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, j) => j !== i) }))} className="text-primary-400 hover:text-primary-700 ml-0.5">
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="villa, moderne, piscine…" className="flex-1" />
                        <Button type="button" variant="outline" size="sm" onClick={addTag}><PlusIcon className="w-4 h-4" /></Button>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4 text-gray-400" /> Caractéristiques
                      </Label>
                      <div className="space-y-2">
                        {formData.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="flex-1">{f}</span>
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, features: prev.features.filter((_, j) => j !== i) }))} className="text-gray-300 hover:text-red-500 transition-colors">
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="Construction antisismique…" className="flex-1" />
                        <Button type="button" variant="outline" size="sm" onClick={addFeature}><PlusIcon className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </m.div>

            </div>

            {/* ── RIGHT SIDEBAR (3 cols) ─────────────────────────── */}
            <div className="lg:col-span-3 space-y-6">
              <div className="sticky top-8 space-y-6">

                {/* Progression */}
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                    <div className="p-5 border-b border-border bg-gray-50/50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-foreground flex items-center justify-between">
                        Progression
                        <span className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-primary-600'}`}>
                          {completionPct}%
                        </span>
                      </h3>
                      <Progress
                        value={completionPct}
                        className={`h-2 mt-3 ${isComplete ? '[&>div]:bg-green-500' : ''}`}
                      />
                    </div>
                    <div className="p-5">
                      <ul className="space-y-3">
                        {COMPLETION_STEPS.map(({ key, label, icon: Icon }) => {
                          const done =
                            key === 'images'     ? formData.images.length > 0 :
                            key === 'coverImage' ? formData.coverImage.trim() !== '' :
                            (formData as any)[key]?.toString().trim() !== ''
                          return (
                            <li key={key} className={`flex items-center gap-3 text-sm ${done ? 'text-green-600 dark:text-green-400 font-medium' : 'text-muted-foreground'}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center border flex-shrink-0 ${done ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'border-border'}`}>
                                {done
                                  ? <CheckCircleIcon className="w-4 h-4" />
                                  : <Icon className="w-3.5 h-3.5" />}
                              </div>
                              {label}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </Card>
                </m.div>

                {/* Actions */}
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <Card className="border-none shadow-lg rounded-2xl bg-card">
                    <CardContent className="pt-6 space-y-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isComplete}
                        title={!isComplete ? `Complétez les ${COMPLETION_STEPS.length - completedSteps} étape(s) restante(s)` : undefined}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting
                          ? 'Enregistrement…'
                          : !isComplete
                            ? `${COMPLETION_STEPS.length - completedSteps} étape(s) manquante(s)`
                            : isEdit ? 'Enregistrer' : 'Créer le projet'}
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={() => router.push('/admin/batipanorama/projects')}>
                        Annuler
                      </Button>
                    </CardContent>
                  </Card>
                </m.div>

                {/* Statut & Publication */}
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="border-none shadow-lg rounded-2xl bg-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Statut & Publication</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="space-y-2">
                        <Label>Statut du projet</Label>
                        <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as any }))}>
                          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="COMPLETED">Terminé</SelectItem>
                              <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                              <SelectItem value="PLANNED">Planifié</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Publié</p>
                          <p className="text-xs text-gray-400">Visible sur le site</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={formData.isPublished ? 'default' : 'secondary'}>
                            {formData.isPublished ? 'En ligne' : 'Brouillon'}
                          </Badge>
                          <Switch
                            checked={formData.isPublished}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="order">Ordre d'affichage</Label>
                        <Input id="order" name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" />
                      </div>
                    </CardContent>
                  </Card>
                </m.div>

                {/* Conseil */}
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 border border-primary-100 dark:border-primary-800">
                    <div className="flex gap-3">
                      <SparklesIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-primary-900 dark:text-primary-300">Conseil</h4>
                        <p className="text-xs text-primary-800 dark:text-primary-200 mt-1 leading-relaxed">
                          Les projets avec plusieurs photos et une description détaillée génèrent beaucoup plus d'intérêt. Pensez à sélectionner la meilleure image comme couverture.
                        </p>
                      </div>
                    </div>
                  </div>
                </m.div>

              </div>
            </div>

            {/* Mobile — bouton flottant */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
              <div className="bg-card rounded-2xl shadow-xl border border-border p-4 flex gap-3">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/batipanorama/projects')} className="flex-1">
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isComplete}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {isSubmitting ? '…' : isComplete ? (isEdit ? 'Enregistrer' : 'Créer') : `${completionPct}%`}
                </Button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

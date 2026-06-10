'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { m } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { Switch } from '@/shared/components/ui/switch'
import { Progress } from '@/shared/components/ui/progress'
import { Badge } from '@/shared/components/ui/badge'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import { BatiServiceFormDataSchema } from '@/features/batipanorama/schemas/batipanorama.schema'
import { getErrorMessage, readApiError } from '@/shared/utils/apiErrors'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceFormProps {
  mode: 'create' | 'edit'
  serviceId?: string
}

// ─── Labels des champs pour les messages d'erreur ─────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  title: 'Titre',
  description: 'Description',
  icon: 'Icône',
  features: 'Caractéristiques',
  isActive: 'Actif',
  order: 'Ordre',
}

// ─── Étapes de complétion ─────────────────────────────────────────────────────

const COMPLETION_STEPS = [
  { key: 'title',       label: 'Titre',       icon: WrenchScrewdriverIcon },
  { key: 'description', label: 'Description', icon: WrenchScrewdriverIcon },
]

// ─── Formulaire par défaut ────────────────────────────────────────────────────

const DEFAULT_FORM = {
  title: '',
  description: '',
  icon: '🏗️',
  features: [] as string[],
  isActive: true,
  order: '0',
}

type ServiceFormState = typeof DEFAULT_FORM

const toServiceFormState = (service: any): ServiceFormState => ({
  title:       service?.title || '',
  description: service?.description || '',
  icon:        service?.icon || DEFAULT_FORM.icon,
  features:    service?.features || [],
  isActive:    service?.isActive ?? true,
  order:       service?.order?.toString() || '0',
})

// ─── Helper erreur ────────────────────────────────────────────────────────────

function FieldError({ name, errors }: { name: string; errors: Record<string, string> }) {
  if (!errors[name]) return null
  return <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ServiceForm(props: ServiceFormProps) {
  const isEdit = props.mode === 'edit'
  const { data: service, isLoading } = useQuery({
    queryKey: ['bati-service-form', props.serviceId],
    enabled: isEdit && !!props.serviceId,
    queryFn: async () => {
      const res = await fetch('/api/bati-services/' + props.serviceId)
      const data = await res.json()
      if (!data.success) throw new Error('Erreur lors du chargement du service')
      return data.service
    },
  })


  return (
    <ServiceFormContent
      {...props}
      initialForm={service ? toServiceFormState(service) : DEFAULT_FORM}
    />
  )
}

function ServiceFormContent({ mode, serviceId, initialForm }: ServiceFormProps & { initialForm: ServiceFormState }) {
  const router = useRouter()
  const isEdit = mode === 'edit'

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData]         = useState(() => initialForm)
  const [fieldErrors, setFieldErrors]   = useState<Record<string, string>>({})
  const [newFeature, setNewFeature]     = useState('')


  // ─── Progression automatique ──────────────────────────────────────────────

  const completedSteps = useMemo(() => {
    return COMPLETION_STEPS.filter(({ key }) => {
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
    const result = BatiServiceFormDataSchema.safeParse(formData)
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
      const url    = isEdit ? `/api/bati-services/${serviceId}` : '/api/bati-services'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })
      if (res.ok) {
        toast.success(isEdit ? 'Service modifié avec succès' : 'Service créé avec succès')
        router.push('/admin/batipanorama/services')
      } else {
        const apiError = await readApiError(res, isEdit ? 'Erreur lors de la modification du service' : 'Erreur lors de la creation du service')
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

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature('')
    }
  }


  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute requiredRole={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href="/admin/batipanorama/services"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center mr-2 group-hover:border-primary/50 group-hover:text-primary transition-all shadow-sm">
                <ArrowLeftIcon className="h-4 w-4" />
              </div>
              Retour aux services
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/20">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {isEdit ? 'Modifier le Service' : 'Nouveau Service'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {isEdit ? (formData.title || 'Chargement…') : 'Créez un nouveau service BatiPanorama'}
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

              {/* Informations du service */}
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                        <WrenchScrewdriverIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <CardTitle>Informations du service</CardTitle>
                        <CardDescription>Les détails essentiels du service</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">

                    {/* Titre */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du service *</Label>
                      <Input
                        id="title" name="title" value={formData.title} onChange={handleChange} required
                        placeholder="Construction & Gros Œuvre"
                        className={fieldErrors.title ? 'border-red-500' : ''}
                      />
                      <FieldError name="title" errors={fieldErrors} />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description" name="description" value={formData.description} onChange={handleChange} required rows={4}
                        placeholder="Description détaillée du service…"
                        className={fieldErrors.description ? 'border-red-500' : ''}
                      />
                      <div className="flex justify-between">
                        <FieldError name="description" errors={fieldErrors} />
                        <p className="text-xs text-muted-foreground">{formData.description.length} / 1 min.</p>
                      </div>
                    </div>

                    {/* Icône & Ordre */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="icon">Icône (emoji)</Label>
                        <Input
                          id="icon" name="icon" value={formData.icon} onChange={handleChange}
                          placeholder="🏗️"
                          className={fieldErrors.icon ? 'border-red-500' : ''}
                        />
                        <FieldError name="icon" errors={fieldErrors} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="order">Ordre d'affichage</Label>
                        <Input
                          id="order" name="order" type="number" value={formData.order} onChange={handleChange}
                          placeholder="0"
                          className={fieldErrors.order ? 'border-red-500' : ''}
                        />
                        <FieldError name="order" errors={fieldErrors} />
                      </div>
                    </div>

                    {/* Caractéristiques */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4 text-gray-400" /> Caractéristiques
                      </Label>
                      <div className="space-y-2">
                        {formData.features.map((f, i) => (
                          <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="flex-1">{f}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, features: prev.features.filter((_, j) => j !== i) }))}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          placeholder="Maçonnerie, béton armé, charpente…"
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Actif */}
                    <div className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">Service actif</p>
                        <p className="text-xs text-muted-foreground">Visible sur le site public</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={formData.isActive ? 'default' : 'secondary'}>
                          {formData.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
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
                          const done = (formData as any)[key]?.toString().trim() !== ''
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
                            : isEdit ? 'Enregistrer' : 'Créer le service'}
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={() => router.push('/admin/batipanorama/services')}>
                        Annuler
                      </Button>
                    </CardContent>
                  </Card>
                </m.div>

                {/* Conseil */}
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 border border-primary-100 dark:border-primary-800">
                    <div className="flex gap-3">
                      <SparklesIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-primary-900 dark:text-primary-300">Conseil</h4>
                        <p className="text-xs text-primary-800 dark:text-primary-200 mt-1 leading-relaxed">
                          Ajoutez des caractéristiques précises pour chaque service afin d'aider vos clients à comprendre exactement ce que vous proposez.
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
                <Button type="button" variant="outline" onClick={() => router.push('/admin/batipanorama/services')} className="flex-1">
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

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  SparklesIcon,
  ClockIcon,
  HashtagIcon,
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
import { BatiProcessStepFormDataSchema } from '@/features/batipanorama/schemas/batipanorama.schema'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProcessStepFormProps {
  mode: 'create' | 'edit'
  stepId?: string
}

// ─── Labels des champs pour les messages d'erreur ─────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  step: 'Numéro d\'étape',
  title: 'Titre',
  description: 'Description',
  icon: 'Icône',
  duration: 'Durée',
  isActive: 'Actif',
}

// ─── Étapes de complétion ─────────────────────────────────────────────────────

const COMPLETION_STEPS = [
  { key: 'step',        label: 'Numéro d\'étape', icon: ClipboardDocumentListIcon },
  { key: 'title',       label: 'Titre',           icon: ClipboardDocumentListIcon },
  { key: 'description', label: 'Description',     icon: ClipboardDocumentListIcon },
]

// ─── Formulaire par défaut ────────────────────────────────────────────────────

const DEFAULT_FORM = {
  step: '',
  title: '',
  description: '',
  icon: '📋',
  duration: '',
  isActive: true,
}

// ─── Helper erreur ────────────────────────────────────────────────────────────

function FieldError({ name, errors }: { name: string; errors: Record<string, string> }) {
  if (!errors[name]) return null
  return <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ProcessStepForm({ mode, stepId }: ProcessStepFormProps) {
  const router = useRouter()
  const isEdit = mode === 'edit'

  const [isLoading, setIsLoading]       = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData]         = useState(DEFAULT_FORM)
  const [fieldErrors, setFieldErrors]   = useState<Record<string, string>>({})

  // ─── Chargement (mode edit) ───────────────────────────────────────────────

  const fetchStep = useCallback(async () => {
    if (!stepId) return
    try {
      const res = await fetch(`/api/bati-process/${stepId}`)
      const data = await res.json()
      if (data.success) {
        const s = data.step
        setFormData({
          step:        s.step?.toString() || '',
          title:       s.title || '',
          description: s.description || '',
          icon:        s.icon || '📋',
          duration:    s.duration || '',
          isActive:    s.isActive ?? true,
        })
      }
    } catch {
      toast.error('Erreur lors du chargement de l\'étape')
    } finally {
      setIsLoading(false)
    }
  }, [stepId])

  useEffect(() => { fetchStep() }, [fetchStep])

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
    const result = BatiProcessStepFormDataSchema.safeParse(formData)
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
      const url    = isEdit ? `/api/bati-process/${stepId}` : '/api/bati-process'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })
      if (res.ok) {
        toast.success(isEdit ? 'Étape modifiée avec succès' : 'Étape créée avec succès')
        router.push('/admin/batipanorama/process')
      } else {
        const err = await res.json()
        toast.error(err.error || (isEdit ? 'Erreur lors de la modification' : 'Erreur lors de la création'))
      }
    } catch {
      toast.error('Une erreur est survenue')
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

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </ProtectedRoute>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute requiredRole={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href="/admin/batipanorama/process"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center mr-2 group-hover:border-primary/50 group-hover:text-primary transition-all shadow-sm">
                <ArrowLeftIcon className="h-4 w-4" />
              </div>
              Retour au processus
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl shadow-lg shadow-primary-500/20">
                  <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {isEdit ? 'Modifier l\'Étape' : 'Nouvelle Étape'}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {isEdit ? (formData.title || 'Chargement…') : 'Créez une nouvelle étape du processus'}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-white dark:bg-gray-800 py-1.5 px-4 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${isSubmitting ? 'bg-yellow-400 animate-pulse' : isComplete ? 'bg-green-500' : 'bg-orange-400'}`} />
                {isSubmitting ? 'Enregistrement…' : isEdit ? 'Mode édition' : 'Mode création'}
              </div>
            </div>
          </motion.div>

          {/* Form — 12-col grid */}
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">

            {/* ── LEFT (9 cols) ──────────────────────────────────── */}
            <div className="lg:col-span-9 space-y-8">

              {/* Informations de l'étape */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <CardTitle>Informations de l'étape</CardTitle>
                        <CardDescription>Les détails essentiels de cette étape du processus</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">

                    {/* Numéro d'étape & Icône */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="step" className="flex items-center gap-1.5">
                          <HashtagIcon className="w-4 h-4 text-gray-400" /> Numéro d'étape *
                        </Label>
                        <Input
                          id="step" name="step" type="number" value={formData.step} onChange={handleChange} required
                          placeholder="1"
                          className={fieldErrors.step ? 'border-red-500' : ''}
                        />
                        <FieldError name="step" errors={fieldErrors} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="icon">Icône (emoji)</Label>
                        <Input
                          id="icon" name="icon" value={formData.icon} onChange={handleChange}
                          placeholder="📋"
                          className={fieldErrors.icon ? 'border-red-500' : ''}
                        />
                        <FieldError name="icon" errors={fieldErrors} />
                      </div>
                    </div>

                    {/* Titre */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre de l'étape *</Label>
                      <Input
                        id="title" name="title" value={formData.title} onChange={handleChange} required
                        placeholder="Consultation initiale"
                        className={fieldErrors.title ? 'border-red-500' : ''}
                      />
                      <FieldError name="title" errors={fieldErrors} />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description" name="description" value={formData.description} onChange={handleChange} required rows={4}
                        placeholder="Description détaillée de cette étape…"
                        className={fieldErrors.description ? 'border-red-500' : ''}
                      />
                      <div className="flex justify-between">
                        <FieldError name="description" errors={fieldErrors} />
                        <p className="text-xs text-muted-foreground">{formData.description.length} / 1 min.</p>
                      </div>
                    </div>

                    {/* Durée */}
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4 text-gray-400" /> Durée (optionnel)
                      </Label>
                      <Input
                        id="duration" name="duration" value={formData.duration} onChange={handleChange}
                        placeholder="1 à 2 semaines"
                        className={fieldErrors.duration ? 'border-red-500' : ''}
                      />
                      <FieldError name="duration" errors={fieldErrors} />
                    </div>

                    {/* Actif */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Étape active</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Visible sur le site public</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={formData.isActive ? 'default' : 'secondary'}>
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>

            </div>

            {/* ── RIGHT SIDEBAR (3 cols) ─────────────────────────── */}
            <div className="lg:col-span-3 space-y-6">
              <div className="sticky top-8 space-y-6">

                {/* Progression */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
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
                            <li key={key} className={`flex items-center gap-3 text-sm ${done ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center border flex-shrink-0 ${done ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'border-gray-200 dark:border-gray-600'}`}>
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
                </motion.div>

                {/* Actions */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <Card className="border-none shadow-lg rounded-2xl bg-white dark:bg-gray-800">
                    <CardContent className="pt-6 space-y-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isComplete}
                        title={!isComplete ? `Complétez les ${COMPLETION_STEPS.length - completedSteps} étape(s) restante(s)` : undefined}
                        className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting
                          ? 'Enregistrement…'
                          : !isComplete
                            ? `${COMPLETION_STEPS.length - completedSteps} étape(s) manquante(s)`
                            : isEdit ? 'Enregistrer' : 'Créer l\'étape'}
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={() => router.push('/admin/batipanorama/process')}>
                        Annuler
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Conseil */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
                    <div className="flex gap-3">
                      <SparklesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Conseil</h4>
                        <p className="text-xs text-blue-800 dark:text-blue-200 mt-1 leading-relaxed">
                          Numérotez vos étapes dans l'ordre souhaité d'affichage. Une description claire et une durée indicative rassurent vos futurs clients.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Mobile — bouton flottant */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-3">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/batipanorama/process')} className="flex-1">
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

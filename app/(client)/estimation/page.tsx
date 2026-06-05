'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalculatorIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  MapPinIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline'
import { ContactFormDataSchema } from '@/features/contacts/schemas/contacts.schema'

const propertyTypes = ['Terrain', 'Maison', 'Villa', 'Appartement', 'Local commercial', 'Immeuble', 'Autre']
const conditions = ['Neuf', 'Très bon état', 'Bon état', 'À rénover', 'En construction', 'Je ne sais pas encore']

export default function EstimationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: '',
    city: '',
    surface: '',
    condition: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'missing'>('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('idle')
    setFieldErrors({})

    const estimationSpecific: Record<string, string> = {}
    if (!formData.propertyType) estimationSpecific.propertyType = 'Sélectionnez un type de bien'
    if (!formData.city.trim()) estimationSpecific.city = 'Ville requise'
    if (!formData.surface.trim() || Number(formData.surface) <= 0) estimationSpecific.surface = 'Surface invalide'
    if (!formData.condition) estimationSpecific.condition = 'Précisez l’état du bien'

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      source: 'estimation' as const,
      message: [
        '[ESTIMATION] Demande d’estimation',
        '',
        `Type de bien : ${formData.propertyType}`,
        `Localisation : ${formData.city}`,
        `Surface : ${formData.surface} m²`,
        `État : ${formData.condition}`,
        '',
        formData.message || 'Aucun détail complémentaire.',
      ].join('\n'),
    }

    const parsed = ContactFormDataSchema.safeParse(payload)
    if (!parsed.success || Object.keys(estimationSpecific).length > 0) {
      const zodErrors: Record<string, string> = {}
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0]
          if (typeof key === 'string' && !zodErrors[key]) zodErrors[key] = issue.message
        }
      }
      setFieldErrors({ ...estimationSpecific, ...zodErrors })
      setStatus('missing')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!response.ok) {
        if (response.status === 400) {
          const body = await response.json().catch(() => ({}))
          if (body?.fieldErrors) setFieldErrors(body.fieldErrors)
          setStatus('missing')
          return
        }
        throw new Error('Estimation request failed')
      }

      setStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        propertyType: '',
        city: '',
        surface: '',
        condition: '',
        message: '',
      })
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full bg-primary-50 px-4 py-1.5 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              Estimation immobilière
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight text-foreground md:text-6xl">
              Obtenez un premier avis sur la valeur de votre bien
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Donnez-nous quelques informations. Nous vous recontactons pour affiner l'estimation selon l'emplacement, l'état du bien et le marché local.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative min-h-[360px] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1400&auto=format&fit=crop"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur dark:bg-gray-900/95">
              <p className="text-sm font-bold text-primary-600 dark:text-primary-400">Premier échange offert</p>
              <p className="mt-1 text-xl font-black text-foreground">Une estimation plus utile qu'un simple chiffre automatique.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-6 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          { icon: ClipboardDocumentListIcon, title: 'Vous envoyez les infos', text: 'Type de bien, surface, quartier, état et détails utiles.' },
          { icon: PresentationChartLineIcon, title: 'Nous analysons le contexte', text: 'Le prix dépend du marché, mais aussi du potentiel réel du bien.' },
          { icon: CalculatorIcon, title: 'On vous recontacte', text: 'Vous recevez un retour clair pour décider de la suite.' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-gray-800">
              <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <h2 className="mt-4 text-xl font-black text-foreground">{item.title}</h2>
              <p className="mt-2 text-muted-foreground">{item.text}</p>
            </div>
          )
        })}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-border dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-foreground">Demander une estimation</h2>
            <p className="mt-2 text-muted-foreground">Plus votre message est précis, plus notre premier retour sera utile.</p>
          </div>

          {status === 'success' && (
            <div className="mb-5 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircleIcon className="h-5 w-5" />
              <p>Votre demande est envoyée. Nous vous recontacterons pour affiner l'estimation.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
              Nous n'avons pas pu envoyer la demande. Réessayez dans un instant.
            </div>
          )}
          {status === 'missing' && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              Merci de corriger les champs indiqués avant d'envoyer la demande.
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom *" className="w-full rounded-xl border border-gray-200 px-4 py-3 dark:border-border dark:bg-gray-900 dark:text-white" />
              {fieldErrors.firstName && <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.firstName}</p>}
            </div>
            <div>
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nom *" className="w-full rounded-xl border border-gray-200 px-4 py-3 dark:border-border dark:bg-gray-900 dark:text-white" />
              {fieldErrors.lastName && <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.lastName}</p>}
            </div>
            <div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="w-full rounded-xl border border-gray-200 px-4 py-3 dark:border-border dark:bg-gray-900 dark:text-white" />
              {fieldErrors.email && <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.email}</p>}
            </div>
            <div>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" className="w-full rounded-xl border border-gray-200 px-4 py-3 dark:border-border dark:bg-gray-900 dark:text-white" />
              {fieldErrors.phone && <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.phone}</p>}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="relative block">
                <HomeIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 dark:border-border dark:bg-gray-900 dark:text-white">
                  <option value="">Type de bien *</option>
                  {propertyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              {fieldErrors.propertyType && <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.propertyType}</p>}
            </div>
            <div>
              <label className="relative block">
                <MapPinIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input name="city" value={formData.city} onChange={handleChange} placeholder="Ville ou quartier *" className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 dark:border-border dark:bg-gray-900 dark:text-white" />
              </label>
              {fieldErrors.city && <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.city}</p>}
            </div>
            <div>
              <input type="number" name="surface" value={formData.surface} onChange={handleChange} min="1" placeholder="Surface en m² *" className="w-full rounded-xl border border-gray-200 px-4 py-3 dark:border-border dark:bg-gray-900 dark:text-white" />
              {fieldErrors.surface && <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.surface}</p>}
            </div>
            <div>
              <select name="condition" value={formData.condition} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-3 dark:border-border dark:bg-gray-900 dark:text-white">
                <option value="">État du bien *</option>
                {conditions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
              </select>
              {fieldErrors.condition && <p className="mt-1 text-xs font-semibold text-red-600">{fieldErrors.condition}</p>}
            </div>
          </div>

          <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="Adresse approximative, accès, documents disponibles, prix souhaité, urgence de vente..." className="mt-4 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 dark:border-border dark:bg-gray-900 dark:text-white" />
          <button disabled={isSubmitting} className="mt-5 w-full rounded-xl bg-primary-600 px-6 py-4 font-bold text-white hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? 'Envoi en cours...' : 'Demander mon estimation'}
          </button>
        </form>
      </section>
    </main>
  )
}

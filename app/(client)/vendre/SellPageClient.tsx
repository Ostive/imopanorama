'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
import {
  ArrowRightIcon,
  BanknotesIcon,
  CameraIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  HomeModernIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { ContactFormDataSchema } from '@/features/contacts/schemas/contacts.schema'

const propertyTypes = [
  { value: 'terrain', label: 'Terrain' },
  { value: 'maison', label: 'Maison' },
  { value: 'villa', label: 'Villa' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'commercial', label: 'Local commercial' },
  { value: 'immeuble', label: 'Immeuble' },
  { value: 'autre', label: 'Autre' },
]

const ownershipStatuses = [
  { value: 'proprietaire', label: 'Je suis propriétaire' },
  { value: 'famille', label: 'Bien familial' },
  { value: 'mandataire', label: 'Je représente le propriétaire' },
  { value: 'a-confirmer', label: 'À confirmer' },
]

const timelines = [
  { value: 'urgent', label: 'Le plus vite possible' },
  { value: '1-3-mois', label: 'Dans 1 à 3 mois' },
  { value: '3-6-mois', label: 'Dans 3 à 6 mois' },
  { value: 'pas-presse', label: 'Je ne suis pas pressé' },
]

const highlights = [
  { icon: CameraIcon, title: 'Présentation soignée', text: 'Photos, description et angles de vente pour donner envie sans survendre.' },
  { icon: BanknotesIcon, title: 'Prix mieux cadré', text: 'On vous aide à positionner le bien avec une lecture réaliste du marché.' },
  { icon: ClipboardDocumentCheckIcon, title: 'Dossier plus clair', text: 'On identifie les infos et documents utiles avant de parler aux acheteurs.' },
]

export default function SellPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyType: '',
    ownershipStatus: '',
    city: '',
    district: '',
    surface: '',
    priceExpectation: '',
    timeline: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'missing'>('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const updateField = (name: keyof typeof formData, value: string) => {
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('idle')
    setFieldErrors({})

    const sellerSpecificErrors: Record<string, string> = {}
    if (!formData.propertyType) sellerSpecificErrors.propertyType = 'Sélectionnez un type de bien'
    if (!formData.ownershipStatus) sellerSpecificErrors.ownershipStatus = 'Précisez votre lien avec le bien'
    if (!formData.city.trim()) sellerSpecificErrors.city = 'La ville est requise'
    if (!formData.surface.trim() || Number(formData.surface) <= 0) sellerSpecificErrors.surface = 'Surface invalide'
    if (!formData.timeline) sellerSpecificErrors.timeline = 'Indiquez un délai'

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      source: 'seller' as const,
      message: [
        '[VENDRE] Demande vendeur',
        '',
        `Type de bien : ${labelFor(propertyTypes, formData.propertyType)}`,
        `Statut propriétaire : ${labelFor(ownershipStatuses, formData.ownershipStatus)}`,
        `Ville : ${formData.city}`,
        `Quartier / zone : ${formData.district || 'Non renseigné'}`,
        `Surface : ${formData.surface} m²`,
        `Prix souhaité : ${formData.priceExpectation || 'Non renseigné'}`,
        `Délai : ${labelFor(timelines, formData.timeline)}`,
        '',
        formData.message || 'Aucun message complémentaire.',
      ].join('\n'),
    }

    const parsed = ContactFormDataSchema.safeParse(payload)
    if (!parsed.success || Object.keys(sellerSpecificErrors).length > 0) {
      const zodErrors: Record<string, string> = {}
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0]
          if (typeof key === 'string' && !zodErrors[key]) zodErrors[key] = issue.message
        }
      }
      setFieldErrors({ ...sellerSpecificErrors, ...zodErrors })
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
        throw new Error('Sell request failed')
      }

      setStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        propertyType: '',
        ownershipStatus: '',
        city: '',
        district: '',
        surface: '',
        priceExpectation: '',
        timeline: '',
        message: '',
      })
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-card">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=1800&auto=format&fit=crop"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/88 to-gray-950/35" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              <SparklesIcon className="h-4 w-4" />
              Vendre avec ImoPanorama
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Votre bien mérite une mise en marché sérieuse
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-200">
              Terrain, maison, villa, appartement ou local commercial : on vous aide à cadrer le prix, présenter le bien et suivre les demandes sans perdre les bons prospects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#formulaire-vendeur" className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-bold text-white transition hover:bg-primary-700">
                Proposer mon bien <ArrowRightIcon className="h-4 w-4" />
              </a>
              <Link href="/estimation" className="inline-flex items-center rounded-xl border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                Demander une estimation
              </Link>
            </div>
          </m.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            Notre méthode
          </span>
          <h2 className="mt-4 text-3xl font-black text-foreground md:text-5xl">
            Un accompagnement vendeur plus propre, plus clair
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-border dark:bg-gray-800">
                <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-foreground">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section id="formulaire-vendeur" className="bg-gray-50 py-16 dark:bg-gray-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <span className="inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              Formulaire vendeur
            </span>
            <h2 className="mt-4 text-3xl font-black text-foreground md:text-5xl">
              Donnez-nous les premières informations
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ce formulaire nous permet de comprendre votre bien avant le premier échange. Vous n'avez pas besoin d'avoir un dossier parfait pour commencer.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { icon: HomeModernIcon, text: 'Type de bien et objectif' },
                { icon: MapPinIcon, text: 'Localisation et surface' },
                { icon: ShieldCheckIcon, text: 'Situation du propriétaire' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.text} className="flex items-center gap-3 text-foreground">
                    <span className="rounded-lg bg-white p-2 text-primary-600 shadow-sm dark:bg-gray-800 dark:text-primary-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-semibold">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-border dark:bg-gray-800">
            {status === 'success' && (
              <div className="mb-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                <CheckCircleIcon className="h-5 w-5 shrink-0" />
                <p>Votre demande est envoyée. Nous allons vous recontacter pour faire le point.</p>
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                L'envoi n'a pas fonctionné. Réessayez dans un instant.
              </div>
            )}
            {status === 'missing' && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                Merci de compléter les champs principaux avant d'envoyer la demande.
              </div>
            )}

            <FormSection number="01" title="Le bien à vendre">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Type de bien *" error={fieldErrors.propertyType}>
                  <Select value={formData.propertyType} onValueChange={(value) => updateField('propertyType', value)}>
                    <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 bg-white px-4 dark:border-border dark:bg-gray-900">
                      <SelectValue placeholder="Sélectionner le bien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Votre lien avec le bien *" error={fieldErrors.ownershipStatus}>
                  <Select value={formData.ownershipStatus} onValueChange={(value) => updateField('ownershipStatus', value)}>
                    <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 bg-white px-4 dark:border-border dark:bg-gray-900">
                      <SelectValue placeholder="Choisir le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {ownershipStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FormSection>

            <FormSection number="02" title="Localisation et surface">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Ville *" error={fieldErrors.city}>
                  <Input name="city" value={formData.city} onChange={handleChange} placeholder="Antananarivo" className="h-12 rounded-xl border-gray-200 px-4 dark:border-border dark:bg-gray-900" />
                </Field>
                <Field label="Quartier ou zone">
                  <Input name="district" value={formData.district} onChange={handleChange} placeholder="Ivandry, Analakely..." className="h-12 rounded-xl border-gray-200 px-4 dark:border-border dark:bg-gray-900" />
                </Field>
                <Field label="Surface approximative *" error={fieldErrors.surface}>
                  <Input type="number" min="1" name="surface" value={formData.surface} onChange={handleChange} placeholder="Ex: 450" className="h-12 rounded-xl border-gray-200 px-4 dark:border-border dark:bg-gray-900" />
                </Field>
                <Field label="Prix souhaité">
                  <Input name="priceExpectation" value={formData.priceExpectation} onChange={handleChange} placeholder="Ex: 75 000 € ou à discuter" className="h-12 rounded-xl border-gray-200 px-4 dark:border-border dark:bg-gray-900" />
                </Field>
              </div>
            </FormSection>

            <FormSection number="03" title="Délai de vente">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Délai souhaité *" error={fieldErrors.timeline}>
                  <Select value={formData.timeline} onValueChange={(value) => updateField('timeline', value)}>
                    <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 bg-white px-4 dark:border-border dark:bg-gray-900">
                      <SelectValue placeholder="Choisir un délai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {timelines.map((timeline) => (
                          <SelectItem key={timeline.value} value={timeline.value}>{timeline.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FormSection>

            <FormSection number="04" title="Vos coordonnées">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Prénom *" error={fieldErrors.firstName}>
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Votre prénom" className="h-12 rounded-xl border-gray-200 px-4 dark:border-border dark:bg-gray-900" />
                </Field>
                <Field label="Nom *" error={fieldErrors.lastName}>
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Votre nom" className="h-12 rounded-xl border-gray-200 px-4 dark:border-border dark:bg-gray-900" />
                </Field>
                <Field label="Email *" error={fieldErrors.email}>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="votre@email.com" className="h-12 rounded-xl border-gray-200 px-4 dark:border-border dark:bg-gray-900" />
                </Field>
                <Field label="Téléphone" error={fieldErrors.phone}>
                  <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+261 34 00 000 00" className="h-12 rounded-xl border-gray-200 px-4 dark:border-border dark:bg-gray-900" />
                </Field>
              </div>
            </FormSection>

            <FormSection number="05" title="Détails utiles">
              <Field label="Message complémentaire">
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="État du bien, accès, documents disponibles, occupation actuelle, contraintes, photos déjà prêtes..."
                  className="min-h-32 resize-none rounded-xl border-gray-200 px-4 py-3 dark:border-border dark:bg-gray-900"
                />
              </Field>
            </FormSection>

            <button type="submit" disabled={isSubmitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-4 font-bold text-white shadow-lg transition hover:bg-primary-700 disabled:opacity-50">
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon dossier vendeur'}
              {!isSubmitting && <ArrowRightIcon className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {children}
      {error && <span className="block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  )
}

function FormSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-border dark:bg-gray-900/50">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-xs font-black text-white">
          {number}
        </span>
        <h3 className="text-lg font-black text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label || value || 'Non renseigné'
}

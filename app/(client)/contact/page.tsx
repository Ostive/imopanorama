'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

const contactReasons = [
  'Acheter un bien',
  'Louer un bien',
  'Vendre ou mettre en location',
  'Construire avec BatiPanorama',
  'Question administrative',
  'Autre demande',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: `Motif : ${formData.reason}\n\n${formData.message}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Contact request failed')
      }

      setStatus('success')
      setFormData({ firstName: '', lastName: '', email: '', phone: '', reason: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              Contact ImoPanorama
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              Parlons de votre projet immobilier
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-200">
              Achat, location, vente, construction ou simple question : dites-nous où vous en êtes, on vous répond avec des informations utiles et concrètes.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          {[
            { icon: PhoneIcon, title: 'Téléphone', value: '+261 20 22 123 45', href: 'tel:+261202212345' },
            { icon: EnvelopeIcon, title: 'Email', value: 'contact@imopanorama.mg', href: 'mailto:contact@imopanorama.mg' },
            { icon: MapPinIcon, title: 'Adresse', value: 'Antananarivo, Madagascar' },
          ].map((item) => {
            const Icon = item.icon
            const content = <span className="text-muted-foreground">{item.value}</span>
            return (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-gray-800">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{item.title}</p>
                    {item.href ? <a href={item.href}>{content}</a> : content}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-border dark:bg-gray-800 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-primary-600 p-3 text-white">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Envoyer une demande</h2>
              <p className="text-sm text-muted-foreground">Réponse claire, sans pression commerciale inutile.</p>
            </div>
          </div>

          {status === 'success' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircleIcon className="mt-0.5 h-5 w-5" />
              <p>Merci, votre message est bien envoyé. Notre équipe revient vers vous rapidement.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5" />
              <p>Nous n'avons pas pu envoyer votre demande. Réessayez dans un instant.</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <UserIcon className="h-4 w-4" /> Prénom *
              </span>
              <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-border dark:bg-gray-900 dark:text-white" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Nom *</span>
              <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-border dark:bg-gray-900 dark:text-white" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Email *</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-border dark:bg-gray-900 dark:text-white" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Téléphone</span>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+261 34 00 000 00" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-border dark:bg-gray-900 dark:text-white" />
            </label>
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-foreground">Votre demande concerne *</span>
            <select name="reason" value={formData.reason} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-border dark:bg-gray-900 dark:text-white">
              <option value="">Choisissez un motif</option>
              {contactReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
            </select>
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-foreground">Message *</span>
            <textarea name="message" value={formData.message} onChange={handleChange} required minLength={10} rows={6} placeholder="Expliquez-nous ce que vous recherchez ou ce que vous souhaitez vendre..." className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-border dark:bg-gray-900 dark:text-white" />
          </label>

          <button disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-primary-600 px-6 py-4 font-bold text-white shadow-lg transition hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </button>
        </form>
      </section>
    </main>
  )
}

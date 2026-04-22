'use client'

import { useState } from 'react'
import { CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { ContactFormDataSchema } from '@/features/contacts/schemas/contacts.schema'

type Status = 'idle' | 'success' | 'error' | 'invalid'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('idle')

    const payload = {
      firstName: 'Abonné',
      lastName: 'Newsletter',
      email,
      source: 'newsletter' as const,
      message: `[NEWSLETTER] Nouvel abonnement à la newsletter — ${email}`,
    }

    const parsed = ContactFormDataSchema.safeParse(payload)
    if (!parsed.success) {
      setStatus('invalid')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!response.ok) throw new Error('Newsletter request failed')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-100">
        <CheckCircleIcon className="h-5 w-5 shrink-0" />
        <p>Merci, vous êtes inscrit. On vous écrit bientôt.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="flex items-center gap-2 rounded-xl bg-white/10 p-1 pl-4 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-primary-400">
        <EnvelopeIcon className="h-5 w-5 text-gray-300" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? '…' : "S'inscrire"}
        </button>
      </label>
      {status === 'invalid' && (
        <p className="text-xs font-semibold text-red-300">Email invalide.</p>
      )}
      {status === 'error' && (
        <p className="text-xs font-semibold text-red-300">L'inscription a échoué. Réessayez.</p>
      )}
    </form>
  )
}

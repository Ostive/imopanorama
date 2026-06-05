'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/features/auth/context/AuthContext'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    try {
      await resetPassword({ email })
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-primary-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/30 p-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary-200 dark:bg-primary-900/30 opacity-20 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-primary-200 dark:bg-primary-900/30 opacity-20 blur-3xl" />
      </div>

      <Link href="/login" className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-xl bg-white/85 dark:bg-gray-900/85 px-4 py-3 text-sm font-bold text-foreground shadow-lg backdrop-blur transition hover:text-primary-600 dark:hover:text-primary-400">
        <ArrowLeftIcon className="h-4 w-4" />
        Connexion
      </Link>

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl">
        <div className="mb-7 text-center">
          <Image src="/images/brand/logo.png" alt="ImoPanorama Madagascar" width={180} height={54} className="mx-auto mb-5 h-14 w-auto object-contain" priority />
          <h1 className="text-3xl font-black text-foreground">Mot de passe oublié ?</h1>
          <p className="mt-2 text-muted-foreground">
            Entrez votre email. Si un compte existe, vous recevrez un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {status === 'success' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 text-green-800 dark:text-green-300">
            <CheckCircleIcon className="mt-0.5 h-5 w-5" />
            <p>Demande envoyée. Vérifiez votre boîte email et vos spams.</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mb-5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-300">
            Nous n'avons pas pu envoyer le lien. Réessayez dans un instant.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-foreground">Email</span>
            <span className="relative block">
              <EnvelopeIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full rounded-xl border-2 border-border bg-card text-foreground py-3.5 pl-12 pr-4 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </span>
          </label>

          <button disabled={isSubmitting} className="w-full rounded-xl bg-primary-600 px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? 'Envoi en cours...' : 'Recevoir le lien'}
          </button>
        </form>
      </motion.section>
    </main>
  )
}

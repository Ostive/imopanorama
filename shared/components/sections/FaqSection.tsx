'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useFaqs } from '@/features/faqs/hooks/useFaqs'

export default function FaqSection() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const { faqs: faqItems, loading, error } = useFaqs({ limit: 4, isActive: true })

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-16 items-start">

          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary-500" />
              <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">
                FAQ
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-[1.05] mb-4">
              Vos questions,{' '}
              <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                nos réponses
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Achat, location, terrain, construction : on répond aux questions qui reviennent vraiment.
            </p>
          </motion.div>

          {/* Right — accordion */}
          <div className="lg:col-span-2">
            {/* Skeleton */}
            {loading && (
              <div className="space-y-0 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-muted/50 border-b border-border/40 last:border-0" />
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-primary-50/60 dark:bg-primary-900/20 rounded-2xl px-6 py-5 text-sm text-muted-foreground">
                Les questions ne sont pas disponibles pour le moment. Réessayez dans un instant.
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && faqItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QuestionMarkCircleIcon className="w-7 h-7 text-primary-500" />
                </div>
                <p className="font-semibold text-foreground mb-1">Les questions arrivent bientôt</p>
                <p className="text-sm text-muted-foreground">
                  En attendant, écrivez-nous et nous vous répondrons directement.
                </p>
              </motion.div>
            )}

            {/* FAQ items — clean divider accordion */}
            {!loading && !error && faqItems.length > 0 && (
              <div>
                {faqItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="border-b border-border/50 last:border-0"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between gap-4 py-6 text-left group"
                    >
                      <span className={`font-semibold text-base transition-colors ${
                        openItem === item.id
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400'
                      }`}>
                        {item.question}
                      </span>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        openItem === item.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-muted text-muted-foreground group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600'
                      }`}>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${
                          openItem === item.id ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {openItem === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 text-muted-foreground text-sm leading-relaxed pr-12">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                <div className="pt-8 text-center">
                  <Link
                    href="/faq"
                    className="group inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:gap-3 transition-all"
                  >
                    Voir toutes les réponses
                    <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            {/* Contact prompt — shown after the questions, as a fallback if they weren't enough */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 p-6 bg-primary-50/70 dark:bg-primary-900/20 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="w-10 h-10 shrink-0 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground">Une question reste ouverte ?</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Envoyez-nous votre demande, on vous répond avec une réponse claire et utile.
                </p>
              </div>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider hover:gap-2.5 transition-all shrink-0"
              >
                Nous contacter
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

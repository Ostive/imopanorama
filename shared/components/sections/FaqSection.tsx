'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useFaqs } from '@/features/faqs/hooks/useFaqs'

export default function FaqSection() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const { faqs: faqItems, loading, error } = useFaqs({
    limit: 4,
    isActive: true,
  })

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12 items-start">

          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold mb-5">
              FAQ
            </span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              Vos questions, nos réponses{' '}
              <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-secondary-500 bg-clip-text text-transparent">
                claires
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Achat, location, terrain, construction : on répond aux questions qui reviennent vraiment.
            </p>

            {/* Info card */}
            <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white mb-1">Une question reste ouverte ?</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Envoyez-nous votre demande, on vous répond avec une réponse claire et utile.
              </p>
            </div>
          </motion.div>

          {/* Right — FAQ accordion */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                Nous n'arrivons pas à charger les questions pour le moment. Réessayez dans un instant.
              </div>
            )}

            {!loading && !error && faqItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QuestionMarkCircleIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Les questions arrivent bientôt
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nous préparons une liste utile. En attendant, écrivez-nous et nous vous répondrons directement.
                </p>
              </motion.div>
            )}

            {!loading && !error && faqItems.length > 0 && (
              <div className="space-y-3">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className={`rounded-2xl border-2 overflow-hidden transition-colors ${
                      openItem === item.id
                        ? 'border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-800'
                        : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span
                        className={`font-semibold text-base ${
                          openItem === item.id
                            ? 'text-primary-700 dark:text-primary-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {item.question}
                      </span>
                      <ChevronDownIcon
                        className={`flex-shrink-0 h-5 w-5 transition-transform duration-200 ${
                          openItem === item.id
                            ? 'rotate-180 text-primary-600 dark:text-primary-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
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
                          <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                <div className="pt-4 text-center">
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm"
                  >
                    Voir toutes les réponses
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

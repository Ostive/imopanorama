'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { AdminPageHeader } from '../../components'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'

interface ProcessStep {
  id: string
  title: string
  description: string
  step: number
  icon: string
  duration?: string
  isActive: boolean
}

export default function BatiProcessPage() {
  const [steps, setSteps]           = useState<ProcessStep[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null; title: string }>({
    show: false, id: null, title: '',
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchSteps = useCallback(async () => {
    try {
      const res = await fetch('/api/bati-process')
      const data = await res.json()
      if (data.success) setSteps(data.steps)
    } catch {
      toast.error('Erreur lors du chargement des étapes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchSteps() }, [fetchSteps])

  const confirmDelete = async () => {
    if (!deleteModal.id) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/bati-process/${deleteModal.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Étape supprimée avec succès')
        setSteps(prev => prev.filter(s => s.id !== deleteModal.id))
        setDeleteModal({ show: false, id: null, title: '' })
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setIsDeleting(false)
    }
  }

  const sorted = [...steps].sort((a, b) => a.step - b.step)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <AdminPageHeader
          icon={<ClipboardDocumentListIcon className="w-6 h-6 text-white" />}
          title="Processus de Construction"
          subtitle="Gérez les étapes du processus"
          showBackButton
          backHref="/admin/batipanorama"
          actions={
            <Link href="/admin/batipanorama/process/new">
              <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:opacity-90">
                <PlusIcon className="h-5 w-5" /> Nouvelle étape
              </Button>
            </Link>
          }
        />

        {/* Table */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['N°', 'Titre', 'Durée', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[1,2,3,4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-1" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-64" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" /></td>
                    <td className="px-6 py-4"><div className="flex gap-2"><div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" /><div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : sorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center shadow-sm"
          >
            <ClipboardDocumentListIcon className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucune étape définie</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Commencez par créer la première étape du processus</p>
            <Link href="/admin/batipanorama/process/new">
              <Button className="bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:opacity-90 gap-2">
                <PlusIcon className="h-5 w-5" /> Créer une étape
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N°</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durée</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {sorted.map((step, i) => (
                    <motion.tr
                      key={step.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {step.step.toString().padStart(2, '0')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{step.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-sm">{step.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        {step.duration
                          ? <Badge variant="secondary" className="text-xs">{step.duration}</Badge>
                          : <span className="text-sm text-gray-400 dark:text-gray-600">—</span>
                        }
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={step.isActive ? 'default' : 'secondary'} className="text-xs">
                          {step.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/batipanorama/process/${step.id}/edit`}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ show: true, id: step.id, title: step.title })}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
              {steps.length} étape{steps.length > 1 ? 's' : ''}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal suppression */}
      <AnimatePresence>
        {deleteModal.show && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteModal({ show: false, id: null, title: '' })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                  <TrashIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Supprimer l&apos;étape</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cette action est irréversible</p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-gray-700 dark:text-gray-300">
                Supprimer <span className="font-bold text-gray-900 dark:text-white">&quot;{deleteModal.title}&quot;</span> ?
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteModal({ show: false, id: null, title: '' })} disabled={isDeleting}>
                  Annuler
                </Button>
                <Button onClick={confirmDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2">
                  {isDeleting
                    ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    : <TrashIcon className="w-4 h-4" />
                  }
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, WrenchScrewdriverIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { AdminPageHeader } from '../../components'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  isActive: boolean
  order: number
}

export default function BatiServicesPage() {
  const [services, setServices]     = useState<Service[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null; title: string }>({
    show: false, id: null, title: '',
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/bati-services')
      const data = await res.json()
      if (data.success) setServices(data.services)
    } catch {
      toast.error('Erreur lors du chargement des services')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  const confirmDelete = async () => {
    if (!deleteModal.id) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/bati-services/${deleteModal.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        toast.success('Service supprimé avec succès')
        setServices(prev => prev.filter(s => s.id !== deleteModal.id))
        setDeleteModal({ show: false, id: null, title: '' })
      } else {
        toast.error(data.error || 'Erreur lors de la suppression')
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <AdminPageHeader
          icon={<WrenchScrewdriverIcon className="w-6 h-6 text-white" />}
          title="Services BatiPanorama"
          subtitle="Gérez vos services de construction"
          showBackButton
          backHref="/admin/batipanorama"
          actions={
            <Link href="/admin/batipanorama/services/new">
              <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-600 text-white hover:opacity-90">
                <PlusIcon className="h-5 w-5" /> Nouveau service
              </Button>
            </Link>
          }
        />

        {/* Table */}
        {isLoading ? (
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {['Icône', 'Titre', 'Caractéristiques', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[1,2,3,4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-10 h-10 bg-muted rounded-xl" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-40 mb-1" /><div className="h-3 bg-muted rounded w-56" /></td>
                    <td className="px-6 py-4"><div className="h-3 bg-muted rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-muted rounded-full w-16" /></td>
                    <td className="px-6 py-4"><div className="flex gap-2"><div className="h-8 w-8 bg-muted rounded" /><div className="h-8 w-8 bg-muted rounded" /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border p-16 text-center shadow-sm"
          >
            <WrenchScrewdriverIcon className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucun service</h3>
            <p className="text-muted-foreground mb-6">Commencez par créer votre premier service</p>
            <Link href="/admin/batipanorama/services/new">
              <Button className="bg-gradient-to-r from-primary-600 to-primary-600 text-white hover:opacity-90 gap-2">
                <PlusIcon className="h-5 w-5" /> Créer un service
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Icône</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Caractéristiques</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {services.map((service, i) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl">
                          {service.icon}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{service.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{service.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        {service.features.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CheckCircleIcon className="w-4 h-4 text-primary-500 shrink-0" />
                            {service.features.length} caractéristique{service.features.length > 1 ? 's' : ''}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={service.isActive ? 'default' : 'secondary'} className="text-xs">
                          {service.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/batipanorama/services/${service.id}/edit`}
                            className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button type="button"
                            onClick={() => setDeleteModal({ show: true, id: service.id, title: service.title })}
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
            <div className="px-6 py-3 border-t border-border text-sm text-muted-foreground">
              {services.length} service{services.length > 1 ? 's' : ''}
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
              className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 border border-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                  <TrashIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Supprimer le service</h3>
                  <p className="text-sm text-muted-foreground">Cette action est irréversible</p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-foreground">
                Supprimer <span className="font-bold text-foreground">&quot;{deleteModal.title}&quot;</span> ?
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

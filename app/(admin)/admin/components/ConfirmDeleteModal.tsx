'use client'

import { motion } from 'framer-motion'
import { TrashIcon } from '@heroicons/react/24/outline'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  title?: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDeleteModal({
  isOpen,
  title = 'Supprimer cet élément ?',
  description = 'Cette action est irréversible. L\'élément sera définitivement effacé de la base de données.',
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-50 dark:bg-red-900/20 p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
            <TrashIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-2 text-sm px-4">{description}</p>
        </div>
        <div className="p-4 bg-muted/50 flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-card border border-border text-foreground rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm"
          >
            Confirmer la suppression
          </button>
        </div>
      </motion.div>
    </div>
  )
}

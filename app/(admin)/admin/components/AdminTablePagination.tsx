'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui'

interface AdminTablePaginationProps {
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function AdminTablePagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: AdminTablePaginationProps) {
  const [goToInput, setGoToInput] = useState('')

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (page > 3) pages.push('...')
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const handleGoTo = (value: string) => {
    const p = parseInt(value)
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p)
      setGoToInput('')
    }
  }

  return (
    <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Afficher</span>
        <Select value={limit.toString()} onValueChange={(v) => onLimitChange(Number(v))}>
          <SelectTrigger className="w-20 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <span className="text-sm text-foreground">sur {total} résultat{total > 1 ? 's' : ''}</span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span key={`e-${i}`} className="px-2 py-2 text-sm text-muted-foreground">...</span>
              ) : (
                <button type="button"
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`min-w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    page === p
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-foreground bg-card border border-border hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
          <span className="sm:hidden px-2 py-2 text-sm text-foreground">{page}/{totalPages}</span>
          <button type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}

      {totalPages > 7 && (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); handleGoTo(goToInput) }}
        >
          <span className="text-sm text-foreground">Aller à</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={goToInput}
            onChange={(e) => setGoToInput(e.target.value)}
            placeholder={`1-${totalPages}`}
            aria-label="Aller à la page"
            className="w-20 h-9 text-sm text-center border border-border bg-card text-foreground rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </form>
      )}
    </div>
  )
}

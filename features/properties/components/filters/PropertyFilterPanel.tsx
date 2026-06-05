'use client'

import { useState } from 'react'
import { PropertyFiltersState } from '../../types/filters.types'
import PropertyFilterBar from './PropertyFilterBar'
import PropertyFilterDrawer from './PropertyFilterDrawer'

interface Props {
  filters: PropertyFiltersState
  onChange: (updates: Partial<PropertyFiltersState>) => void
  onReset: () => void
  activeFilterCount: number
  total: number
}

export default function PropertyFilterPanel({
  filters,
  onChange,
  onReset,
  activeFilterCount,
  total,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <PropertyFilterBar
        selectedTypes={filters.selectedTypes}
        transactionType={filters.transactionType}
        activeFilterCount={activeFilterCount}
        onTransactionTypeChange={transactionType => onChange({ transactionType })}
        onSelectedTypesChange={selectedTypes => onChange({ selectedTypes })}
        onOpenDrawer={() => setOpen(true)}
        drawerOpen={open}
      />
      <PropertyFilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        filters={filters}
        onChange={onChange}
        onReset={onReset}
        total={total}
      />
    </>
  )
}

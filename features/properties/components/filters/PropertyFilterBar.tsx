'use client'

import { m } from 'framer-motion'
import {
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  MapIcon,
  ShoppingBagIcon,
  KeyIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { PropertyType, TransactionType } from '../../types/properties.types'
import { PROPERTY_CATEGORIES, PropertyCategoryKey } from '../../types/filters.types'

interface Props {
  selectedTypes: PropertyType[]
  transactionType: TransactionType | ''
  activeFilterCount: number
  onTransactionTypeChange: (value: TransactionType | '') => void
  onSelectedTypesChange: (types: PropertyType[]) => void
  onOpenDrawer: () => void
  drawerOpen?: boolean
}

const CATEGORY_META: Array<{
  key: PropertyCategoryKey
  Icon: React.ComponentType<{ className?: string }>
  label: string
}> = [
  { key: 'terrains', Icon: MapIcon, label: 'Terrains' },
  { key: 'villas', Icon: HomeIcon, label: 'Maisons & Villas' },
  { key: 'apartments', Icon: BuildingOfficeIcon, label: 'Appartements' },
  { key: 'commercial', Icon: BuildingStorefrontIcon, label: 'Commercial' },
]

export default function PropertyFilterBar({
  selectedTypes,
  transactionType,
  activeFilterCount,
  onTransactionTypeChange,
  onSelectedTypesChange,
  onOpenDrawer,
  drawerOpen,
}: Props) {
  const selectCategory = (category: PropertyCategoryKey) => {
    const types = PROPERTY_CATEGORIES[category]
    const allSelected = types.every(t => selectedTypes.includes(t))
    const next = allSelected
      ? selectedTypes.filter(t => !types.includes(t))
      : Array.from(new Set([...selectedTypes, ...types]))
    onSelectedTypesChange(next)
  }

  return (
    <div className="bg-card border-b border-border sticky top-16 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2.5 sm:py-3">
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <m.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onTransactionTypeChange(transactionType === 'SALE' ? '' : 'SALE')}
                className={`shrink-0 h-9 w-9 sm:w-auto sm:px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
                  transactionType === 'SALE'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Acheter"
              >
                <ShoppingBagIcon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Acheter</span>
              </m.button>

              <m.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onTransactionTypeChange(transactionType === 'RENT' ? '' : 'RENT')}
                className={`shrink-0 h-9 w-9 sm:w-auto sm:px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
                  transactionType === 'RENT'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Louer"
              >
                <KeyIcon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Louer</span>
              </m.button>

              <div className="shrink-0 h-6 w-px bg-gray-300 dark:bg-gray-600" />

              {CATEGORY_META.map(({ key, Icon, label }) => (
                <m.button
                  key={key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectCategory(key)}
                  className={`shrink-0 h-9 w-9 sm:w-auto sm:px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
                    PROPERTY_CATEGORIES[key].every(t => selectedTypes.includes(t))
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                      : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                </m.button>
              ))}
            </div>
          </div>

          <div className="shrink-0 ml-auto flex items-center gap-2">
            <m.button
              whileTap={{ scale: 0.95 }}
              onClick={onOpenDrawer}
              className={`h-9 px-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 text-sm border ${
                drawerOpen || activeFilterCount > 0
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-foreground border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Affiner</span>
              {activeFilterCount > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/25 text-white">
                  {activeFilterCount}
                </span>
              )}
            </m.button>
          </div>
        </div>
      </div>
    </div>
  )
}

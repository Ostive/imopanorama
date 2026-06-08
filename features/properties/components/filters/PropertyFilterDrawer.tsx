'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Squares2X2Icon,
  HomeIcon,
  MapIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline'
import { TransactionType } from '../../types/properties.types'
import { PropertyFiltersState } from '../../types/filters.types'
import { getFilterApplicability, COMMON_AMENITIES } from '../../utils/filterApplicability'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { MARKET_CONFIGS, getMarketConfig } from '@/shared/config/markets'

interface Props {
  open: boolean
  onClose: () => void
  filters: PropertyFiltersState
  onChange: (updates: Partial<PropertyFiltersState>) => void
  onReset: () => void
  total: number
}

const FIELD_BASE =
  'w-full h-[46px] px-4 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all'

export default function PropertyFilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onReset,
  total,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const applicability = getFilterApplicability(filters.selectedTypes)
  const activeMarket = getMarketConfig(filters.country || undefined)

  const toggleAmenity = (value: string) => {
    const next = filters.selectedAmenities.includes(value)
      ? filters.selectedAmenities.filter(a => a !== value)
      : [...filters.selectedAmenities, value]
    onChange({ selectedAmenities: next })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[2500]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-card z-[2600] shadow-2xl flex flex-col"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  Affiner votre recherche
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Affinez votre recherche
                </p>
              </div>
              <button type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable filters */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* 1. Transaction Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShoppingBagIcon className="h-4 w-4 text-primary-500" />
                  Type de transaction
                </label>
                <Select
                  value={filters.transactionType || 'all'}
                  onValueChange={value =>
                    onChange({ transactionType: value === 'all' ? '' : (value as TransactionType) })
                  }
                >
                  <SelectTrigger className="w-full !h-[46px] !px-4 !py-0 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="SALE">Vente</SelectItem>
                    <SelectItem value="RENT">Location</SelectItem>
                    <SelectItem value="SEASONAL_RENT">Location saisonnière</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 2. Market */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MapPinIcon className="h-4 w-4 text-primary-500" />
                    Pays / marche
                  </label>
                  <Select
                    value={filters.country || 'all'}
                    onValueChange={value => onChange({ country: value === 'all' ? '' : value })}
                  >
                    <SelectTrigger className="w-full !h-[46px] !px-4 !py-0 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous pays</SelectItem>
                      {Object.values(MARKET_CONFIGS).map(market => (
                        <SelectItem key={market.country} value={market.country}>{market.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MapPinIcon className="h-4 w-4 text-primary-500" />
                    Region
                  </label>
                  <input
                    type="text"
                    value={filters.region}
                    onChange={e => onChange({ region: e.target.value })}
                    placeholder="Ex: Analamanga"
                    className={FIELD_BASE}
                  />
                </div>
              </div>

              {/* 3. City */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPinIcon className="h-4 w-4 text-primary-500" />
                  Ville ou quartier
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={filters.city}
                    onChange={e => onChange({ city: e.target.value })}
                    placeholder="Ex: Antananarivo"
                    className="w-full h-[46px] pl-9 pr-4 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                  />
                  {filters.city && (
                    <button type="button"
                      onClick={() => onChange({ city: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                    >
                      <XMarkIcon className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Price Range */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BanknotesIcon className="h-4 w-4 text-primary-500" />
                  Budget souhaite ({activeMarket.currency})
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={e => onChange({ minPrice: e.target.value })}
                      placeholder="Min"
                      className="w-full h-[46px] pl-4 pr-8 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                      {activeMarket.currency}
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={e => onChange({ maxPrice: e.target.value })}
                      placeholder="Max"
                      className="w-full h-[46px] pl-4 pr-8 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                      {activeMarket.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Size Range */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapIcon className="h-4 w-4 text-primary-500" />
                  Surface recherchée
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={filters.minSize}
                      onChange={e => onChange({ minSize: e.target.value })}
                      placeholder="Min"
                      className="w-full h-[46px] pl-4 pr-10 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                      m²
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={filters.maxSize}
                      onChange={e => onChange({ maxSize: e.target.value })}
                      placeholder="Max"
                      className="w-full h-[46px] pl-4 pr-10 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                      m²
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Bedrooms */}
              {applicability.bedrooms && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <HomeIcon className="h-4 w-4 text-primary-500" />
                    Chambres (Min - Max)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minBedrooms}
                      onChange={e => onChange({ minBedrooms: e.target.value })}
                      placeholder="Min"
                      min="0"
                      className={FIELD_BASE}
                    />
                    <input
                      type="number"
                      value={filters.maxBedrooms}
                      onChange={e => onChange({ maxBedrooms: e.target.value })}
                      placeholder="Max"
                      min="0"
                      className={FIELD_BASE}
                    />
                  </div>
                </div>
              )}

              {/* 6. Bathrooms */}
              {applicability.bathrooms && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <SparklesIcon className="h-4 w-4 text-primary-500" />
                    Salles de bain minimum
                  </label>
                  <input
                    type="number"
                    value={filters.minBathrooms}
                    onChange={e => onChange({ minBathrooms: e.target.value })}
                    placeholder="0"
                    min="0"
                    className={FIELD_BASE}
                  />
                </div>
              )}

              {/* 7. Rooms */}
              {applicability.rooms && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Squares2X2Icon className="h-4 w-4 text-primary-500" />
                    Nombre de pièces minimum
                  </label>
                  <input
                    type="number"
                    value={filters.minRooms}
                    onChange={e => onChange({ minRooms: e.target.value })}
                    placeholder="0"
                    min="0"
                    className={FIELD_BASE}
                  />
                </div>
              )}

              {/* 8. Floor */}
              {applicability.floor && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <BuildingLibraryIcon className="h-4 w-4 text-primary-500" />
                    Étage (Min - Max)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minFloor}
                      onChange={e => onChange({ minFloor: e.target.value })}
                      placeholder="Min"
                      min="0"
                      className={FIELD_BASE}
                    />
                    <input
                      type="number"
                      value={filters.maxFloor}
                      onChange={e => onChange({ maxFloor: e.target.value })}
                      placeholder="Max"
                      min="0"
                      className={FIELD_BASE}
                    />
                  </div>
                </div>
              )}

              {/* 9. Year Built */}
              {applicability.yearBuilt && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CalendarIcon className="h-4 w-4 text-primary-500" />
                    Année de construction
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minYearBuilt}
                      onChange={e => onChange({ minYearBuilt: e.target.value })}
                      placeholder="Depuis"
                      min="1900"
                      max={new Date().getFullYear()}
                      className={FIELD_BASE}
                    />
                    <input
                      type="number"
                      value={filters.maxYearBuilt}
                      onChange={e => onChange({ maxYearBuilt: e.target.value })}
                      placeholder="Jusqu'à"
                      min="1900"
                      max={new Date().getFullYear()}
                      className={FIELD_BASE}
                    />
                  </div>
                </div>
              )}

              {/* 10. Condition */}
              {applicability.condition && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <WrenchScrewdriverIcon className="h-4 w-4 text-primary-500" />
                    État souhaité
                  </label>
                  <Select
                    value={filters.condition || 'all'}
                    onValueChange={value => onChange({ condition: value === 'all' ? '' : value })}
                  >
                    <SelectTrigger className="w-full !h-[46px] !px-4 !py-0 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Peu importe</SelectItem>
                      <SelectItem value="NEW">Neuf</SelectItem>
                      <SelectItem value="EXCELLENT">Excellent état</SelectItem>
                      <SelectItem value="GOOD">Bon état</SelectItem>
                      <SelectItem value="TO_RENOVATE">À rénover</SelectItem>
                      <SelectItem value="UNDER_CONSTRUCTION">En construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 11. Amenities */}
              {applicability.amenities && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <SparklesIcon className="h-4 w-4 text-primary-500" />
                    Équipements souhaités
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_AMENITIES.map(amenity => {
                      const selected = filters.selectedAmenities.includes(amenity.value)
                      return (
                        <button
                          key={amenity.value}
                          type="button"
                          onClick={() => toggleAmenity(amenity.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                            selected
                              ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                              : 'bg-card text-foreground border-border hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
                          }`}
                        >
                          {amenity.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-border flex gap-3">
              <button type="button"
                onClick={onReset}
                className="px-4 py-3 rounded-xl bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 font-medium transition-all flex items-center gap-2 border border-transparent hover:border-red-200 dark:hover:border-red-800 text-sm"
              >
                <XMarkIcon className="h-4 w-4" />
                Tout effacer
              </button>
              <button type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl text-sm"
              >
                Voir les biens {total > 0 && `(${total})`}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

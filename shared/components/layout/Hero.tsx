'use client'

import { useReducer } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { m, AnimatePresence } from 'framer-motion'
import { SparklesIcon, MapPinIcon, ShieldCheckIcon, MagnifyingGlassIcon, CurrencyDollarIcon, KeyIcon, HomeIcon, BanknotesIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

const PROPERTY_TYPES = [
  { id: 'HOUSE', label: 'Maison' },
  { id: 'APARTMENT', label: 'Appartement' },
  { id: 'LAND', label: 'Terrain' },
  { id: 'COMMERCIAL', label: 'Commerce' },
]

type HeroSearchState = {
  searchQuery: string
  transactionType: 'SALE' | 'RENT' | ''
  propertyTypes: string[]
  isPropertyTypeOpen: boolean
  budget: string
}

type HeroSearchAction =
  | { type: 'search'; value: string }
  | { type: 'transaction'; value: 'SALE' | 'RENT' | '' }
  | { type: 'toggle-property-type'; value: string }
  | { type: 'toggle-property-dropdown' }
  | { type: 'budget'; value: string }

const heroSearchInitialState: HeroSearchState = {
  searchQuery: '',
  transactionType: '',
  propertyTypes: [],
  isPropertyTypeOpen: false,
  budget: '',
}

function heroSearchReducer(state: HeroSearchState, action: HeroSearchAction): HeroSearchState {
  switch (action.type) {
    case 'search':
      return { ...state, searchQuery: action.value }
    case 'transaction':
      return { ...state, transactionType: action.value }
    case 'toggle-property-type':
      return {
        ...state,
        propertyTypes: state.propertyTypes.includes(action.value)
          ? state.propertyTypes.filter(type => type !== action.value)
          : [...state.propertyTypes, action.value],
      }
    case 'toggle-property-dropdown':
      return { ...state, isPropertyTypeOpen: !state.isPropertyTypeOpen }
    case 'budget':
      return { ...state, budget: action.value }
  }
}

function HeroDesktopImage() {
  return (
    <m.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="hidden lg:block relative"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary-100/80 via-primary-50/60 to-secondary-100/80 rounded-4xl"></div>
      <div className="absolute inset-0 rounded-4xl bg-[linear-gradient(rgba(255,255,255,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.26)_1px,transparent_1px)] bg-[size:36px_36px]"></div>

      <div className="relative h-137.5 flex items-end justify-center overflow-hidden rounded-4xl">
        <Image
          src="/images/hero/home-agent.png"
          alt="Agent immobilier professionnel"
          width={480}
          height={550}
          className="object-contain object-bottom relative z-10 w-auto h-full max-w-full drop-shadow-2xl"
          priority
          sizes="(max-width: 768px) 100vw, 480px"
        />
      </div>

      <m.div
        initial={{ opacity: 0, x: -20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.7, type: "spring", stiffness: 80, damping: 15 }}
        className="absolute top-16 -left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/60 dark:border-border/60 z-20"
      >
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-green-400 to-green-600 p-3 rounded-xl">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">Conseil local</p>
            <p className="text-xs text-muted-foreground font-medium leading-tight">À votre écoute</p>
          </div>
        </div>
      </m.div>

      <m.div
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.7, type: "spring", stiffness: 80, damping: 15 }}
        className="absolute top-1/3 -right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/60 dark:border-border/60 z-20"
      >
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-amber-400 to-amber-600 p-3 rounded-xl">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">5.0/5</p>
            <p className="text-xs text-muted-foreground font-medium leading-tight">Clients accompagnés</p>
          </div>
        </div>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: -15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.35, duration: 0.7, type: "spring", stiffness: 80, damping: 15 }}
        className="absolute -top-6 -right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/60 dark:border-border/60 z-20"
      >
        <div className="text-center">
          <div className="text-3xl font-black bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">500+</div>
          <p className="text-sm text-muted-foreground font-semibold mt-1">Biens à découvrir</p>
        </div>
      </m.div>
    </m.div>
  )
}

export default function Hero() {
  const router = useRouter()
  /* import { HomeIcon, BanknotesIcon } from '@heroicons/react/24/outline' - Make sure these are imported at the top */
  const [state, dispatch] = useReducer(heroSearchReducer, heroSearchInitialState)
  const { searchQuery, transactionType, propertyTypes, isPropertyTypeOpen, budget } = state

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set('search', searchQuery)
    }
    if (transactionType) {
      params.set('transactionType', transactionType)
    }
    if (propertyTypes.length > 0) {
      params.set('type', propertyTypes.join(','))
    }
    if (budget) {
      params.set('maxPrice', budget)
    }

    router.push(`/proprietes${params.toString() ? '?' + params.toString() : ''}`)
  }

  const togglePropertyType = (type: string) => {
    dispatch({ type: 'toggle-property-type', value: type })
  }

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-linear-to-br from-primary-50/40 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 lg:bg-none dark:lg:bg-linear-to-br dark:lg:from-gray-900 dark:lg:to-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* Content */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col justify-between relative h-full"
          >
            <div className="space-y-6 lg:space-y-8">
              {/* Mobile Header Layout (Side-by-Side) */}
              {/* Mobile Header Layout (Side-by-Side) */}
              <div className="flex flex-row items-end justify-between gap-2 lg:block relative z-10 w-full">
                <div className="w-[60%] lg:w-full flex flex-col gap-4 pb-20 lg:pb-0">
                  <m.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-left text-[1.75rem] leading-[1.1] sm:text-4xl lg:text-6xl font-black text-foreground tracking-tight lg:px-0"
                  >
                    Trouvez un lieu qui vous ressemble{' '}
                    <span className="relative inline-block">
                      <span className="bg-linear-to-r from-primary-600 via-primary-600 to-secondary-500 bg-clip-text text-transparent">
                        vraiment
                      </span>
                      <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
                        <path d="M0,7 Q50,0 100,7 T200,7" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary-300" opacity="0.5" />
                      </svg>
                    </span>
                    {' '}à Madagascar
                  </m.h1>

                  {/* Tablet Description (In-flow with title) */}
                  <m.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="hidden md:block lg:hidden text-sm sm:text-base text-muted-foreground leading-relaxed font-medium"
                  >
                    Achat, location ou investissement : on vous aide à avancer sereinement, avec des biens sélectionnés et des conseils clairs à chaque étape.
                  </m.p>
                  <m.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="hidden lg:block text-lg text-muted-foreground leading-relaxed max-w-2xl"
                  >
                    Achat, location ou investissement : on vous aide à avancer sereinement, avec des biens sélectionnés et des conseils clairs à chaque étape.
                  </m.p>
                </div>

                {/* Mobile Agent Image (Side, overlapping right) */}
                <m.div
                  initial={{ opacity: 0, scale: 0.95, x: 15 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-[45%] h-[220px] lg:hidden relative flex items-end justify-center mr-[-16px] z-0 translate-y-6"
                >
                  <div className="absolute inset-x-4 bottom-0 h-32 rounded-t-[48px] bg-primary-100/70"></div>

                  <div className="relative w-full h-full">
                    <Image
                      src="/images/hero/home-agent.png"
                      alt="Agent"
                      fill
                      className="object-contain object-bottom drop-shadow-xl scale-125 origin-bottom"
                      priority
                      sizes="(max-width: 768px) 200px, 400px"
                    />
                  </div>
                </m.div>
              </div>


            </div>

            {/* Search Form - Left aligned below text but full width */}
            <m.form
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              onSubmit={handleSearch}
              className="relative -mt-12 lg:mt-0 w-full lg:min-w-[calc(200%+3rem)] max-w-none z-20"
            >
              {/* Tabs (Connected Folder design) */}
              <div className="relative z-20 -mb-px w-full lg:w-fit">
                <div className="flex w-full lg:w-auto bg-white/95 dark:bg-gray-800/95 lg:bg-white/80 lg:dark:bg-gray-800/80 backdrop-blur-md rounded-t-4xl lg:rounded-t-3xl p-0 lg:p-1.5 lg:pb-2 border-b-0 border-white/50 dark:border-border/50 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'transaction', value: 'SALE' })}
                    className={`flex-1 lg:flex-none justify-center px-4 py-4 lg:px-8 lg:py-3 rounded-none first:rounded-tl-4xl last:rounded-tr-none lg:first:rounded-[1.2rem] font-bold text-base transition-all duration-300 flex items-center gap-2 ${transactionType === 'SALE' || transactionType === ''
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                  >
                    <CurrencyDollarIcon className="h-5 w-5" />
                    <span>Acheter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'transaction', value: 'RENT' })}
                    className={`flex-1 lg:flex-none justify-center px-4 py-4 lg:px-8 lg:py-3 rounded-none first:rounded-tr-none last:rounded-tr-4xl lg:last:rounded-[1.2rem] font-bold text-base transition-all duration-300 flex items-center gap-2 ${transactionType === 'RENT'
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                  >
                    <KeyIcon className="h-5 w-5" />
                    <span>Louer</span>
                  </button>
                </div>
              </div>

              {/* Main Container Card */}
              <div className="bg-white/95 dark:bg-gray-800/95 lg:bg-white/80 lg:dark:bg-gray-800/80 backdrop-blur-md p-6 pb-12 lg:p-16 rounded-4xl rounded-t-none lg:rounded-4xl lg:rounded-tl-none shadow-2xl border border-white/50 dark:border-border/50 z-10 relative">

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                  {/* Location Input (Larger) */}
                  <div className="md:col-span-12 lg:col-span-4 group">
                    <div className="relative h-full">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => dispatch({ type: 'search', value: e.target.value })}
                        placeholder="Où souhaitez-vous chercher ?"
                        aria-label="Où souhaitez-vous chercher ?"
                        className="block w-full pl-11 pr-4 py-4 h-full bg-card border border-border rounded-[1.2rem] text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Property Type Select */}
                  <div className="md:col-span-6 lg:col-span-3">
                    <div className="relative h-full">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                        <HomeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'toggle-property-dropdown' })}
                        className="w-full pl-11 pr-4 py-4 h-auto min-h-14.5 bg-card border border-border rounded-[1.2rem] text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium flex items-center justify-between group"
                      >
                        <span className={`truncate ${propertyTypes.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {propertyTypes.length > 0
                            ? propertyTypes.map(t => PROPERTY_TYPES.find(pt => pt.id === t)?.label).join(', ')
                            : 'Quel type de bien ?'}
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isPropertyTypeOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isPropertyTypeOpen && (
                          <m.div
                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                            className="absolute top-[calc(100%+8px)] left-0 w-full bg-card rounded-[1.2rem] shadow-xl border border-border p-2 z-50 overflow-hidden"
                          >
                            <div className="flex flex-col gap-1">
                              {PROPERTY_TYPES.map((type) => (
                                <button
                                  type="button"
                                  key={type.id}
                                  aria-pressed={propertyTypes.includes(type.id)}
                                  className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-colors"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    togglePropertyType(type.id);
                                  }}
                                >
                                  {/* Custom Checkbox Visual */}
                                  <div className={`
                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                    ${propertyTypes.includes(type.id)
                                      ? 'bg-primary-600 border-primary-600'
                                      : 'border-border bg-input'
                                    }
                                  `}>
                                    {propertyTypes.includes(type.id) && (
                                      <CheckIcon className="w-3.5 h-3.5 text-white stroke-3" />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-foreground cursor-pointer flex-1">
                                    {type.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Budget Input */}
                  <div className="md:col-span-6 lg:col-span-3">
                    <div className="relative h-full">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BanknotesIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => dispatch({ type: 'budget', value: e.target.value })}
                        placeholder="Votre budget max"
                        aria-label="Budget maximum"
                        className="block w-full pl-11 pr-4 py-4 h-full bg-card border border-border rounded-[1.2rem] text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max lg:static lg:w-auto lg:translate-x-0 md:col-span-12 lg:col-span-2 z-30">
                    <button
                      type="submit"
                      className="w-full h-full min-h-14 px-8 py-3 lg:px-0 lg:py-0 bg-linear-to-r from-primary-600 to-primary-500 text-white rounded-full lg:rounded-[1.2rem] font-bold text-base shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                      <span className="inline lg:hidden">Rechercher</span>
                      <span className="hidden lg:inline">Rechercher</span>
                    </button>
                  </div>
                </div>
              </div>
            </m.form>





            {/* Spacer for search form on mobile */}
            <div className="lg:hidden h-70"></div>
          </m.div>

          <HeroDesktopImage />
        </div>


      </div>
    </section >
  )
}

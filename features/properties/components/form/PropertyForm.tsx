'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  PhotoIcon,
  XMarkIcon,
  HomeIcon,
  MapPinIcon,
  BanknotesIcon,
  SparklesIcon,
  BuildingOffice2Icon,
  PlusIcon,
  ArrowsPointingOutIcon,
  FolderIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CubeTransparentIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import { PropertyFormDataSchema } from '@/features/properties/schemas/properties.schema'
import { MultipleImageUploader, MultipleImageUploaderHandle } from '@/features/upload/components/MultipleImageUploader'
import { uploadImages } from '@/features/upload/services/uploadImages'
import { MediaLibraryModal } from '@/features/upload/components/MediaLibraryModal'
import LocationPicker from '@/shared/components/map/LocationPicker'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/shared/components/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Switch } from '@/shared/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { Separator } from '@/shared/components/ui/separator'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import { FormSkeleton } from '@/shared/components/loading'
import { DEFAULT_MARKET, MARKET_CONFIGS, SUPPORTED_CURRENCIES, getMarketConfig } from '@/shared/config/markets'

// ─── Small helpers ────────────────────────────────────────────────────────────

function FieldError({ name, errors }: { name: string; errors: Record<string, string> }) {
  if (!errors[name]) return null
  return <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
}

function TooltipLabel({ htmlFor, label, tooltip, required }: { htmlFor: string; label: string; tooltip: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={htmlFor}>{label}{required && ' *'}</Label>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger type="button" tabIndex={-1}>
            <InformationCircleIcon className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropertyFormProps {
  mode: 'create' | 'edit'
  propertyId?: string
  initialType?: string
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Titre',
  description: 'Description',
  propertyType: 'Type de propriété',
  transactionType: 'Type de transaction',
  location: 'Quartier',
  city: 'Ville',
  country: 'Pays',
  region: 'Region',
  district: 'District',
  commune: 'Commune',
  fokontany: 'Fokontany',
  address: 'Adresse',
  zipCode: 'Code postal',
  price: 'Prix',
  pricePerM2: 'Prix au m²',
  rentPrice: 'Loyer',
  totalSize: 'Surface totale',
  livingSize: 'Surface habitable',
  landSize: 'Surface terrain',
  bedrooms: 'Chambres',
  bathrooms: 'Salles de bain',
  rooms: 'Pièces',
  floors: 'Étages',
  floor: 'Étage',
  yearBuilt: 'Année de construction',
  condition: 'État',
  features: 'Caractéristiques',
  amenities: 'Commodités',
  images: 'Images',
  status: 'Statut',
  reference: 'Référence',
  energyClass: 'Classe énergétique',
}

const OPTIONAL_FIELDS = new Set([
  'condition', 'energyClass', 'emissions', 'coverImage', 'virtualTour', 'videoUrl',
  'address', 'zipCode', 'description', 'reference',
  'region', 'district', 'commune', 'fokontany', 'legalStatus',
  'pricePerM2', 'rentPrice', 'livingSize', 'landSize',
  'bedrooms', 'bathrooms', 'rooms', 'floors', 'floor', 'yearBuilt',
  'taxFonciere', 'charges',
])

const FEATURES_LIST = [
  'Accès PMR', 'Belle hauteur sous plafond', "Bord de l'eau", 'Buanderie', 'Bureau',
  'Cave', 'Cellier', 'Cheminée', 'Climatisation', 'Cuisine équipée',
  'Cuisine ouverte', 'Domotique', 'Double vitrage', 'Dressing', 'Exposition Sud',
  'Fibre optique', 'Grenier', 'Ilot central', 'Lumineux', 'Mezzanine',
  'Moulures', 'Parquet', 'Poutres apparentes', 'Sans vis-à-vis', 'Suite parentale',
  'Véranda', 'Volets électriques', 'Vue dégagée', 'Vue mer', 'Vue panoramique',
].sort((a, b) => a.localeCompare(b, 'fr'))

const AMENITIES_LIST = [
  'Accès autoroute', 'Aire de jeux', 'Alarme', 'Ascenseur', 'Balcon',
  'Barbecue', 'Box fermé', 'Digicode', 'Garage', 'Gardien',
  'Groupe électrogène', 'Interphone', 'Jardin', 'Parking', 'Parking visiteurs',
  'Piscine', 'Portail électrique', 'Potager', "Près d'une école", 'Près des commerces',
  'Près du bus', "Près d'un parc", 'Quartier calme', 'Résidence sécurisée', "Réservoir d'eau",
  'Rooftop', 'Salle de sport', 'Spa/Jacuzzi', 'Sécurité 24/7', 'Terrain de basket',
  'Terrain de tennis', 'Terrasse', 'Verger', 'Vidéosurveillance',
].sort((a, b) => a.localeCompare(b, 'fr'))

const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  propertyType: '',
  transactionType: 'SALE',
  location: '',
  city: '',
  country: DEFAULT_MARKET,
  region: '',
  district: '',
  commune: '',
  fokontany: '',
  address: '',
  zipCode: '',
  coordinates: { lat: -18.8792, lng: 47.5079 },
  price: '',
  pricePerM2: '',
  rentPrice: '',
  currency: getMarketConfig(DEFAULT_MARKET).currency,
  totalSize: '',
  livingSize: '',
  landSize: '',
  bedrooms: '',
  bathrooms: '',
  rooms: '',
  floors: '',
  floor: '',
  yearBuilt: '',
  condition: '',
  features: [] as string[],
  amenities: [] as string[],
  images: [] as string[],
  coverImage: '',
  virtualTour: '',
  videoUrl: '',
  reference: '',
  legalStatus: '',
  documentStatus: 'UNKNOWN',
  isVerified: false,
  energyClass: '',
  emissions: '',
  status: 'AVAILABLE',
  isFeatured: false,
  isPublished: true,
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PropertyForm({ mode, propertyId, initialType = '' }: PropertyFormProps) {
  const router = useRouter()
  const isEdit = mode === 'edit'

  const [isLoading, setIsLoading] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 7
  const imageUploaderRef = useRef<MultipleImageUploaderHandle>(null)

  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    propertyType: initialType,
  })

  const [newFeature, setNewFeature] = useState('')
  const [newAmenity, setNewAmenity] = useState('')
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [featureSearch, setFeatureSearch] = useState('')
  const [amenitySearch, setAmenitySearch] = useState('')

  // ─── Derived flags ─────────────────────────────────────────────────────────

  const isTerrain = formData.propertyType.startsWith('TERRAIN_')
  const isResidential = ['VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE', 'APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT'].includes(formData.propertyType)
  const isApartment = ['APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT'].includes(formData.propertyType)
  const isHouse = ['VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE'].includes(formData.propertyType)
  const currentMarket = getMarketConfig(formData.country)
  const currencyLabel = formData.currency || currentMarket.currency

  // ─── Effects ───────────────────────────────────────────────────────────────

  // Load existing property data (edit mode only)
  useEffect(() => {
    if (!isEdit || !propertyId) return
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`)
        if (!response.ok) throw new Error('Propriété non trouvée')
        const result = await response.json()
        const data = result.data
        setFormData({
          title: data.title || '',
          description: data.description || '',
          propertyType: data.propertyType || '',
          transactionType: data.transactionType || 'SALE',
          location: data.location || '',
          city: data.city || '',
          country: data.country || DEFAULT_MARKET,
          region: data.region || '',
          district: data.district || '',
          commune: data.commune || '',
          fokontany: data.fokontany || '',
          address: data.address || '',
          zipCode: data.zipCode || '',
          coordinates: data.coordinates || { lat: -18.8792, lng: 47.5079 },
          price: data.price?.toString() || '',
          pricePerM2: data.pricePerM2?.toString() || '',
          rentPrice: data.rentPrice?.toString() || '',
          currency: data.currency || getMarketConfig(data.country || DEFAULT_MARKET).currency,
          totalSize: data.totalSize?.toString() || '',
          livingSize: data.livingSize?.toString() || '',
          landSize: data.landSize?.toString() || '',
          bedrooms: data.bedrooms?.toString() || '',
          bathrooms: data.bathrooms?.toString() || '',
          rooms: data.rooms?.toString() || '',
          floors: data.floors?.toString() || '',
          floor: data.floor?.toString() || '',
          yearBuilt: data.yearBuilt?.toString() || '',
          condition: data.condition || '',
          features: data.features || [],
          amenities: data.amenities || [],
          images: data.images || [],
          coverImage: data.coverImage || '',
          virtualTour: data.virtualTour || '',
          videoUrl: data.videoUrl || '',
          reference: data.reference || '',
          legalStatus: data.legalStatus || '',
          documentStatus: data.documentStatus || 'UNKNOWN',
          isVerified: data.isVerified || false,
          energyClass: data.energyClass || '',
          emissions: data.emissions || '',
          status: data.status || 'AVAILABLE',
          isFeatured: data.isFeatured || false,
          isPublished: data.isPublished ?? true,
        })
      } catch (err: any) {
        toast.error(err.message || 'Impossible de charger la propriété')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProperty()
  }, [isEdit, propertyId])

  // Auto-generate reference number on create
  useEffect(() => {
    if (!isEdit && !formData.reference) {
      const year = new Date().getFullYear()
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      setFormData(prev => ({ ...prev, reference: `PROP-${year}-${random}` }))
    }
  }, [])

  // Auto-calculate price per m²
  useEffect(() => {
    if (formData.price && formData.totalSize) {
      const priceNum = parseFloat(formData.price)
      const sizeNum = parseFloat(formData.totalSize)
      if (!isNaN(priceNum) && !isNaN(sizeNum) && sizeNum > 0) {
        setFormData(prev => ({ ...prev, pricePerM2: (priceNum / sizeNum).toFixed(2) }))
      }
    }
  }, [formData.price, formData.totalSize])

  // Auto-update step indicator
  useEffect(() => {
    let step = 1
    if (formData.title && formData.propertyType) step = 2
    if (step >= 2 && formData.address && formData.city) step = 3
    if (step >= 3 && formData.price) step = 4
    if (step >= 4 && formData.totalSize) step = 5
    if (step >= 4) step = 5
    if (step >= 5 && (formData.features.length > 0 || formData.amenities.length > 0)) step = 6
    if (step >= 6 && formData.images.length > 0) step = 7
    setCurrentStep(step)
  }, [formData])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (index: number) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities.filter((_, i) => i !== index) }))
  }

  const handleImagesChange = (imageUrls: string[]) => {
    setFormData(prev => ({ ...prev, images: imageUrls }))
  }

  const handleMediaLibrarySelect = (url: string) => {
    if (!formData.images.includes(url)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }))
    }
    setShowMediaLibrary(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          if (OPTIONAL_FIELDS.has(key) && (value === '' || value === null)) return [key, undefined]
          return [key, value]
        })
      )

      const result = PropertyFormDataSchema.safeParse(cleanedData)
      if (!result.success) {
        const errors: Record<string, string> = {}
        result.error.issues.forEach(err => {
          errors[err.path.join('.')] = err.message
        })
        setFieldErrors(errors)
        const messages = result.error.issues.map(err => {
          const label = FIELD_LABELS[err.path.join('.')] || err.path.join('.')
          return `${label} : ${err.message}`
        })
        toast.error(messages.join('\n'), { duration: 6000 })
        setIsSubmitting(false)
        return
      }

      // Upload pending images
      let finalImages: string[] = []
      if (imageUploaderRef.current) {
        const existingUrls = imageUploaderRef.current.getExistingUrls()
        const pendingFiles = imageUploaderRef.current.getPendingFiles()
        let uploadedUrls: string[] = []
        if (pendingFiles.length > 0) {
          toast.loading('Upload des images en cours...', { id: 'img-upload' })
          uploadedUrls = await uploadImages(pendingFiles, '/images/properties/')
          imageUploaderRef.current.replacePendingWithUrls(uploadedUrls)
          toast.dismiss('img-upload')
        }
        finalImages = [...existingUrls, ...uploadedUrls]
      }

      const url = isEdit ? `/api/properties/${propertyId}` : '/api/properties'
      const method = isEdit ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, images: finalImages }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erreur lors de la ${isEdit ? 'mise à jour' : 'création'}`)
      }

      toast.success(`Propriété "${formData.title}" ${isEdit ? 'mise à jour' : 'créée'} avec succès`)
      router.push('/admin/proprietes')
    } catch (err: any) {
      toast.dismiss('img-upload')
      toast.error(err.message || 'Une erreur est survenue', { duration: 5000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Loading state (edit only) ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-primary-50/20 py-8">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <FormSkeleton fields={8} />
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute requiredRole={['admin', 'super_admin']}>
      <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-primary-50/20 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href="/admin/proprietes"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center mr-2 group-hover:border-primary/50 group-hover:text-primary transition-all shadow-sm">
                <ArrowLeftIcon className="h-4 w-4" />
              </div>
              Retour à la liste
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/20">
                  <BuildingOffice2Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {isEdit ? 'Modifier la Propriété' : 'Nouvelle Propriété'}
                  </h1>
                  <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-yellow-500" />
                    {isEdit ? (formData.title || 'Chargement...') : 'Créez une annonce exceptionnelle'}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-card py-1.5 px-4 rounded-full border border-border shadow-sm">
                <span className={`w-2 h-2 rounded-full ${isSubmitting ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
                {isSubmitting ? 'Enregistrement...' : isEdit ? 'Mode édition' : 'Mode création'}
              </div>
            </div>
          </motion.div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-9 space-y-8">

              {/* BLOCK A — Informations de base */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                        <HomeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <CardTitle>Informations de base</CardTitle>
                        <CardDescription>Les détails essentiels de votre propriété</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Devise *</Label>
                        <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value as typeof prev.currency }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {SUPPORTED_CURRENCIES.map(currency => (
                              <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <TooltipLabel htmlFor="title" label="Titre" required tooltip="Un titre accrocheur et descriptif augmente le taux de clics. Incluez le type de bien et un point fort." />
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="Ex: Villa moderne avec piscine" className={fieldErrors.title ? 'border-red-500' : ''} />
                        <FieldError errors={fieldErrors} name="title" />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <TooltipLabel htmlFor="description" label="Description" tooltip="Une description détaillée (min. 50 caractères) améliore le référencement et attire plus de contacts." />
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Décrivez les caractéristiques principales de la propriété..." className={fieldErrors.description ? 'border-red-500' : ''} />
                        <div className="flex justify-between">
                          <FieldError errors={fieldErrors} name="description" />
                          <p className="text-xs text-muted-foreground">{formData.description.length} / 50 min.</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Type de propriété *</Label>
                        <Select value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))} required>
                          <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Terrains</SelectLabel>
                              <SelectItem value="TERRAIN_RESIDENTIAL">Terrain Résidentiel</SelectItem>
                              <SelectItem value="TERRAIN_COMMERCIAL">Terrain Commercial</SelectItem>
                              <SelectItem value="TERRAIN_AGRICULTURAL">Terrain Agricole</SelectItem>
                              <SelectItem value="TERRAIN_INDUSTRIAL">Terrain Industriel</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Maisons & Villas</SelectLabel>
                              <SelectItem value="VILLA">Villa</SelectItem>
                              <SelectItem value="HOUSE">Maison</SelectItem>
                              <SelectItem value="TOWNHOUSE">Maison de ville</SelectItem>
                              <SelectItem value="COUNTRY_HOUSE">Maison de campagne</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Appartements</SelectLabel>
                              <SelectItem value="APARTMENT">Appartement</SelectItem>
                              <SelectItem value="STUDIO">Studio</SelectItem>
                              <SelectItem value="PENTHOUSE">Penthouse</SelectItem>
                              <SelectItem value="DUPLEX">Duplex</SelectItem>
                              <SelectItem value="LOFT">Loft</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Commercial</SelectLabel>
                              <SelectItem value="OFFICE">Bureau</SelectItem>
                              <SelectItem value="SHOP">Boutique</SelectItem>
                              <SelectItem value="WAREHOUSE">Entrepôt</SelectItem>
                              <SelectItem value="BUILDING">Immeuble</SelectItem>
                              <SelectItem value="HOTEL">Hôtel</SelectItem>
                              <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transactionType">Type de transaction *</Label>
                        <Select value={formData.transactionType} onValueChange={(value) => setFormData(prev => ({ ...prev, transactionType: value }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SALE">Vente</SelectItem>
                            <SelectItem value="RENT">Location</SelectItem>
                            <SelectItem value="SEASONAL_RENT">Location saisonnière</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* BLOCK A2 — Statut & Visibilité */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card border-l-4 border-l-indigo-500">
                  <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                        <EyeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <CardTitle>Statut et visibilité</CardTitle>
                        <CardDescription>Définissez le statut et la visibilité dès le départ</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="status">Statut</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AVAILABLE">Disponible</SelectItem>
                            <SelectItem value="RESERVED">Réservé</SelectItem>
                            <SelectItem value="SOLD">Vendu</SelectItem>
                            <SelectItem value="RENTED">Loué</SelectItem>
                            <SelectItem value="DRAFT">Brouillon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <Label htmlFor="isPublished" className="font-medium cursor-pointer">Publié</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">Visible par les visiteurs</p>
                        </div>
                        <Switch id="isPublished" checked={formData.isPublished} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <Label htmlFor="isFeatured" className="font-medium cursor-pointer">En vedette</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">Afficher en page d'accueil</p>
                        </div>
                        <Switch id="isFeatured" checked={formData.isFeatured} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* BLOCK A3 - Confiance & documents */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle>Confiance et documents</CardTitle>
                        <CardDescription>Renseignez le statut juridique sans bloquer les autres marches</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="legalStatus">Statut foncier / juridique</Label>
                        <Select value={formData.legalStatus || 'NONE'} onValueChange={(value) => setFormData(prev => ({ ...prev, legalStatus: value === 'NONE' ? '' : value }))}>
                          <SelectTrigger><SelectValue placeholder="Non renseigne" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NONE">Non renseigne</SelectItem>
                            <SelectItem value="TITLED">Titre foncier</SelectItem>
                            <SelectItem value="CADASTRAL">Cadastre</SelectItem>
                            <SelectItem value="UNTITLED">Non titre</SelectItem>
                            <SelectItem value="LONG_TERM_LEASE">Bail long terme</SelectItem>
                            <SelectItem value="CO_OWNERSHIP">Copropriete</SelectItem>
                            <SelectItem value="COMPANY_OWNED">Detenu par societe</SelectItem>
                            <SelectItem value="OTHER">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="documentStatus">Etat des documents</Label>
                        <Select value={formData.documentStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, documentStatus: value }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UNKNOWN">Non renseigne</SelectItem>
                            <SelectItem value="PENDING">En verification</SelectItem>
                            <SelectItem value="PARTIAL">Documents partiels</SelectItem>
                            <SelectItem value="VERIFIED">Documents verifies</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <Label htmlFor="isVerified" className="font-medium cursor-pointer">Bien verifie</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">Visible comme signal de confiance</p>
                        </div>
                        <Switch id="isVerified" checked={formData.isVerified} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVerified: checked }))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* BLOCK B — Localisation */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <MapPinIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle>Localisation</CardTitle>
                        <CardDescription>Cliquez sur la carte pour définir l'emplacement exact</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays / marche *</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            country: value as typeof prev.country,
                            currency: getMarketConfig(value).currency,
                          }))}
                        >
                          <SelectTrigger><SelectValue placeholder="Selectionner..." /></SelectTrigger>
                          <SelectContent>
                            {Object.values(MARKET_CONFIGS).map(market => (
                              <SelectItem key={market.country} value={market.country}>
                                {market.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse *</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Ex: Lot 123 Ivandry" className={fieldErrors.address ? 'border-red-500' : ''} />
                        <FieldError errors={fieldErrors} name="address" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville *</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Ex: Antananarivo" className={fieldErrors.city ? 'border-red-500' : ''} />
                        <FieldError errors={fieldErrors} name="city" />
                      </div>
                      <div className="space-y-2">
                        <TooltipLabel htmlFor="location" label="Quartier" tooltip="Le quartier est utilisé comme filtre de recherche principal. Soyez précis." />
                        <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Ex: Ivandry" className={fieldErrors.location ? 'border-red-500' : ''} />
                        <FieldError errors={fieldErrors} name="location" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Code postal</Label>
                        <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Ex: 101" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Input id="region" name="region" value={formData.region} onChange={handleChange} placeholder="Ex: Analamanga" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input id="district" name="district" value={formData.district} onChange={handleChange} placeholder="Ex: Antananarivo Avaradrano" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="commune">Commune</Label>
                        <Input id="commune" name="commune" value={formData.commune} onChange={handleChange} placeholder="Ex: Antananarivo Renivohitra" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fokontany">Fokontany / secteur</Label>
                        <Input id="fokontany" name="fokontany" value={formData.fokontany} onChange={handleChange} placeholder="Ex: Ambatobe" />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Emplacement sur la carte *</Label>
                      <p className="text-sm text-muted-foreground">Cliquez sur la carte pour placer le marqueur à l'emplacement exact de la propriété</p>
                      <div className="mt-3 rounded-lg overflow-hidden border">
                        <LocationPicker
                          initialCoordinates={formData.coordinates}
                          onCoordinatesChange={(coords) => setFormData(prev => ({ ...prev, coordinates: coords }))}
                          onLocationDataChange={(locationData) => {
                            setFormData(prev => ({
                              ...prev,
                              address: locationData.address || prev.address,
                              city: locationData.city || prev.city,
                              location: locationData.suburb || prev.location,
                              zipCode: locationData.postcode || prev.zipCode,
                            }))
                          }}
                          height="400px"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        📍 Coordonnées: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* BLOCK C — Prix */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                        <BanknotesIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <CardTitle>Prix</CardTitle>
                        <CardDescription>Informations tarifaires</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formData.transactionType === 'SALE' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="price">Prix de vente ({currencyLabel}) *</Label>
                            <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required min="0" step="0.01" className={fieldErrors.price ? 'border-red-500' : ''} />
                            <p className="text-xs text-muted-foreground">Devise: {currencyLabel}</p>
                            <FieldError errors={fieldErrors} name="price" />
                          </div>
                          <div className="space-y-2">
                            <TooltipLabel htmlFor="pricePerM2" label={`Prix au m² (${currencyLabel})`} tooltip="Calculé automatiquement à partir du prix de vente et de la surface totale." />
                            <Input id="pricePerM2" name="pricePerM2" type="number" value={formData.pricePerM2} disabled className="bg-muted cursor-not-allowed" />
                            <p className="text-xs text-muted-foreground">Calculé automatiquement: Prix ÷ Surface totale</p>
                          </div>
                        </>
                      )}
                      {(formData.transactionType === 'RENT' || formData.transactionType === 'SEASONAL_RENT') && (
                        <div className="space-y-2">
                          <Label htmlFor="rentPrice">
                            {formData.transactionType === 'SEASONAL_RENT' ? `Prix de location saisonniere (${currencyLabel}/nuit) *` : `Prix de location (${currencyLabel}/mois) *`}
                          </Label>
                          <Input id="rentPrice" name="rentPrice" type="number" value={formData.rentPrice} onChange={handleChange} required min="0" step="0.01" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* BLOCK D — Dimensions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-card">
                  <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <ArrowsPointingOutIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle>Dimensions</CardTitle>
                        <CardDescription>Surfaces et mesures</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="totalSize">Surface totale (m²) *</Label>
                        <Input id="totalSize" type="number" name="totalSize" value={formData.totalSize} onChange={handleChange} required min="0" step="0.01" className={fieldErrors.totalSize ? 'border-red-500' : ''} />
                        <FieldError errors={fieldErrors} name="totalSize" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="livingSize">Surface habitable (m²)</Label>
                        <Input id="livingSize" type="number" name="livingSize" value={formData.livingSize} onChange={handleChange} min="0" step="0.01" disabled={isTerrain} className={isTerrain ? 'bg-gray-100 cursor-not-allowed' : ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landSize">Surface terrain (m²)</Label>
                        <Input id="landSize" type="number" name="landSize" value={formData.landSize} onChange={handleChange} min="0" step="0.01" disabled={isApartment} className={isApartment ? 'bg-gray-100 cursor-not-allowed' : ''} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* BLOCK E — Détails de la propriété */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">Détails de la propriété</h2>
                {isTerrain ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Les détails de propriété ne sont pas applicables aux terrains.</p>
                    <p className="text-xs text-muted-foreground mt-2">Passez directement aux caractéristiques et équipements ci-dessous.</p>
                  </div>
                ) : (
                  <>
                    {!isResidential && <p className="text-sm text-muted-foreground mb-4">Ces champs sont optionnels pour ce type de propriété</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Chambres</Label>
                        <Input id="bedrooms" type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Salles de bain</Label>
                        <Input id="bathrooms" type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rooms">Nombre de pièces</Label>
                        <Input id="rooms" type="number" name="rooms" value={formData.rooms} onChange={handleChange} min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floors">Nombre d'étages</Label>
                        <Input id="floors" type="number" name="floors" value={formData.floors} onChange={handleChange} min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floor">Étage</Label>
                        <Input id="floor" type="number" name="floor" value={formData.floor} onChange={handleChange} min="0" disabled={isHouse} className={isHouse ? 'bg-gray-100 cursor-not-allowed' : ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearBuilt">Année de construction</Label>
                        <Input id="yearBuilt" type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} min="1800" max={new Date().getFullYear()} />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label htmlFor="condition">État</Label>
                        <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">Neuf</SelectItem>
                            <SelectItem value="EXCELLENT">Excellent</SelectItem>
                            <SelectItem value="GOOD">Bon</SelectItem>
                            <SelectItem value="TO_RENOVATE">À rénover</SelectItem>
                            <SelectItem value="UNDER_CONSTRUCTION">En construction</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="energyClass">Classe énergétique</Label>
                        <Select value={formData.energyClass} onValueChange={(value) => setFormData(prev => ({ ...prev, energyClass: value }))}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A - Très performant</SelectItem>
                            <SelectItem value="B">B - Performant</SelectItem>
                            <SelectItem value="C">C - Assez performant</SelectItem>
                            <SelectItem value="D">D - Moyen</SelectItem>
                            <SelectItem value="E">E - Peu performant</SelectItem>
                            <SelectItem value="F">F - Très peu performant</SelectItem>
                            <SelectItem value="G">G - Extrêmement peu performant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reference">Référence — Auto-générée</Label>
                        <Input id="reference" name="reference" value={formData.reference} disabled className="bg-muted cursor-not-allowed font-mono" />
                        <p className="text-xs text-muted-foreground">Référence unique générée automatiquement</p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

              {/* BLOCK F — Caractéristiques */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">Caractéristiques</h2>
                {formData.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">{formData.features.length} sélectionnée(s) :</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-lg text-sm font-medium">
                          {feature}
                          <button type="button" onClick={() => removeFeature(index)} className="text-primary-600 hover:text-primary-800 ml-0.5">
                            <XMarkIcon className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mb-3 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="text" value={featureSearch} onChange={(e) => setFeatureSearch(e.target.value)} placeholder="Filtrer les caractéristiques..." className="pl-9 h-9 text-sm" />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4 max-h-48 overflow-y-auto pr-1">
                  {FEATURES_LIST.filter(f => !featureSearch || f.toLowerCase().includes(featureSearch.toLowerCase())).map((feature) => {
                    const isSelected = formData.features.includes(feature)
                    return (
                      <button key={feature} type="button" onClick={() => setFormData(prev => ({ ...prev, features: isSelected ? prev.features.filter(f => f !== feature) : [...prev.features, feature] }))}
                        className={`px-2.5 py-1 text-sm rounded-lg transition-all ${isSelected ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700'}`}>
                        {isSelected ? <CheckCircleIcon className="h-3.5 w-3.5 inline mr-1" /> : <PlusIcon className="h-3 w-3 inline mr-1" />}
                        {feature}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-2">
                  <Input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="Ajouter une caractéristique personnalisée..." className="flex-1" />
                  <Button type="button" onClick={addFeature} variant="outline" size="sm">Ajouter</Button>
                </div>
              </motion.div>

              {/* BLOCK G — Commodités */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <SparklesIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Commodités</h2>
                </div>
                {formData.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">{formData.amenities.length} sélectionnée(s) :</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-lg text-sm font-medium">
                          {amenity}
                          <button type="button" onClick={() => removeAmenity(index)} className="text-primary-600 hover:text-primary-800 ml-0.5">
                            <XMarkIcon className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mb-3 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="text" value={amenitySearch} onChange={(e) => setAmenitySearch(e.target.value)} placeholder="Filtrer les commodités..." className="pl-9 h-9 text-sm" />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4 max-h-48 overflow-y-auto pr-1">
                  {AMENITIES_LIST.filter(a => !amenitySearch || a.toLowerCase().includes(amenitySearch.toLowerCase())).map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity)
                    return (
                      <button key={amenity} type="button" onClick={() => setFormData(prev => ({ ...prev, amenities: isSelected ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity] }))}
                        className={`px-2.5 py-1 text-sm rounded-lg transition-all ${isSelected ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700'}`}>
                        {isSelected ? <CheckCircleIcon className="h-3.5 w-3.5 inline mr-1" /> : <PlusIcon className="h-3 w-3 inline mr-1" />}
                        {amenity}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-2">
                  <Input type="text" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())} placeholder="Ajouter une commodité personnalisée..." className="flex-1" />
                  <Button type="button" onClick={addAmenity} variant="outline" size="sm">Ajouter</Button>
                </div>
              </motion.div>

              {/* BLOCK H — Images */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                    <PhotoIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Images</h2>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">💡 Astuce : Utilisez des images de haute qualité (min. 1200x800px) pour un meilleur rendu</p>
                  <Button type="button" variant="outline" onClick={() => setShowMediaLibrary(true)} className="gap-2">
                    <FolderIcon className="w-4 h-4" />
                    Médiathèque
                  </Button>
                </div>
                <MultipleImageUploader ref={imageUploaderRef} onImagesChange={handleImagesChange} initialImages={formData.images} maxImages={15} />
              </motion.div>

              {/* BLOCK I — Visite virtuelle & Vidéo */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CubeTransparentIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Visite virtuelle & Vidéo</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="virtualTour" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <CubeTransparentIcon className="w-4 h-4 text-purple-500" />
                      URL visite virtuelle 360°
                    </Label>
                    <Input id="virtualTour" type="url" placeholder="https://my.matterport.com/show/?m=... ou autre lien 360°" value={formData.virtualTour || ''} onChange={(e) => setFormData(prev => ({ ...prev, virtualTour: e.target.value }))} className="font-mono text-sm" />
                    <p className="text-xs text-muted-foreground mt-1">Compatible Matterport, Kuula, Ricoh360, Pano2VR, etc. (lien iframe)</p>
                  </div>
                  <div>
                    <Label htmlFor="videoUrl" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <VideoCameraIcon className="w-4 h-4 text-red-500" />
                      URL vidéo de présentation
                    </Label>
                    <Input id="videoUrl" type="url" placeholder="https://www.youtube.com/embed/... ou https://vimeo.com/..." value={formData.videoUrl || ''} onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))} className="font-mono text-sm" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Utilisez le lien d'intégration YouTube (<code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">youtube.com/embed/ID</code>) ou Vimeo
                    </p>
                  </div>
                  {(formData.virtualTour || formData.videoUrl) && (
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                        ✅ {[formData.virtualTour && 'Visite virtuelle', formData.videoUrl && 'Vidéo'].filter(Boolean).join(' + ')} renseigné{(formData.virtualTour && formData.videoUrl) ? 's' : ''}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Ces contenus apparaîtront sur la page publique de la propriété.</p>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
            {/* END LEFT COLUMN */}

            {/* RIGHT COLUMN — Sidebar */}
            <div className="lg:col-span-3 hidden lg:block h-full">
              <div className="sticky top-8 space-y-6">

                {/* Progress */}
                <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                  <div className="p-5 border-b border-border bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-foreground flex items-center justify-between">
                      Progression
                      <span className="text-primary-600 text-sm">{Math.round((currentStep / totalSteps) * 100)}%</span>
                    </h3>
                    <Progress value={(currentStep / totalSteps) * 100} className="h-2 mt-3" />
                  </div>
                  <div className="p-5">
                    <ul className="space-y-3">
                      {[
                        { step: 1, label: 'Infos de base', icon: HomeIcon },
                        { step: 2, label: 'Localisation', icon: MapPinIcon },
                        { step: 3, label: 'Prix', icon: BanknotesIcon },
                        { step: 4, label: 'Dimensions', icon: ArrowsPointingOutIcon },
                        { step: 5, label: 'Détails', icon: BuildingOffice2Icon },
                        { step: 6, label: 'Caractéristiques', icon: SparklesIcon },
                        { step: 7, label: 'Images', icon: PhotoIcon },
                      ].map((item) => (
                        <li key={item.step} className={`flex items-center gap-3 text-sm ${currentStep >= item.step ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentStep >= item.step ? 'bg-primary-50 border-primary-200' : 'border-gray-200'}`}>
                            {currentStep > item.step ? <CheckCircleIcon className="w-4 h-4" /> : <item.icon className="w-3.5 h-3.5" />}
                          </div>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Publication */}
                <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                  <div className="p-5">
                    <h3 className="font-bold text-foreground mb-4">Publication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Visibilité</span>
                        <Badge variant={formData.isPublished ? 'default' : 'secondary'}>
                          {formData.isPublished ? 'En ligne' : 'Brouillon'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button type="button" variant="outline" onClick={() => router.push('/admin/proprietes')} disabled={isSubmitting} className="w-full">
                          Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700">
                          {isSubmitting ? '...' : isEdit ? 'Enregistrer' : 'Créer'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 border border-primary-100 dark:border-primary-800">
                  <div className="flex gap-3">
                    <SparklesIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-primary-900 dark:text-primary-300">Conseil Pro</h4>
                      <p className="text-xs text-primary-800 dark:text-primary-200 mt-1 leading-relaxed">
                        Les annonces avec au moins 5 photos et une description détaillée obtiennent 3x plus de contacts. N'oubliez pas la visite virtuelle !
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* MOBILE FLOATING ACTIONS */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
              <div className="bg-card rounded-2xl shadow-xl border border-border p-4 flex gap-3">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/proprietes')} disabled={isSubmitting} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary-600 hover:bg-primary-700">
                  {isSubmitting ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer la propriété'}
                </Button>
              </div>
            </div>

          </form>
        </div>
      </div>

      <MediaLibraryModal isOpen={showMediaLibrary} onClose={() => setShowMediaLibrary(false)} onSelect={handleMediaLibrarySelect} />
    </ProtectedRoute>
  )
}

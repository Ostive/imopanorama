'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function PropertySearch({ onSearch }: { onSearch: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    minPrice: 0,
    maxPrice: 1000000,
    parkingType: '',
    parkingSize: 0,
    boatLength: 0,
    boatType: '',
    landArea: 0,
    bedrooms: 0,
    bathrooms: 0,
    livingSpace: 0,
    builtYear: 0,
    floors: 0,
    commercialRooms: 0,
    commercialSpace: 0,
  })

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      location: '',
      minPrice: 0,
      maxPrice: 1000000,
      parkingType: '',
      parkingSize: 0,
      boatLength: 0,
      boatType: '',
      landArea: 0,
      bedrooms: 0,
      bathrooms: 0,
      livingSpace: 0,
      builtYear: 0,
      floors: 0,
      commercialRooms: 0,
      commercialSpace: 0,
    })
    setShowAdvancedFilters(false)
  }

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSliderChange = useCallback((name: string, value: number[]) => {
    setFilters(prev => ({ ...prev, [name]: value[0] }))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search filters:', filters)
    onSearch(filters)  // Pass the filters to the parent component or API
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-background rounded-lg shadow">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-grow min-w-[200px]">
          <Label htmlFor="search" className="sr-only">Recherche générale</Label>
          <Input
            id="search"
            name="search"
            placeholder="Rechercher des propriétés..."
            value={filters.search}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-[150px]">
          <Label htmlFor="type" className="sr-only">Type de propriété</Label>
          <Select name="type" onValueChange={(value) => handleSelectChange('type', value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Tous Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous Type</SelectItem>
              <SelectItem value="parking">Parking</SelectItem>
              <SelectItem value="boat">Bateau</SelectItem>
              <SelectItem value="land">Terrain</SelectItem>
              <SelectItem value="residential">Résidentiel</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[150px]">
          <Label htmlFor="location" className="sr-only">Localisation</Label>
          <Input
            id="location"
            name="location"
            placeholder="Localisation"
            value={filters.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-[200px]">
          <Label htmlFor="price" className="sr-only">Prix</Label>
          <Select name="price" onValueChange={(value) => {
            const [min, max] = value.split('-').map(Number)
            setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
          }}>
            <SelectTrigger id="price">
              <SelectValue placeholder="Tous Prix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous Prix</SelectItem>
              <SelectItem value="0-100000">0€ - 100,000€</SelectItem>
              <SelectItem value="100000-250000">100,000€ - 250,000€</SelectItem>
              <SelectItem value="250000-500000">250,000€ - 500,000€</SelectItem>
              <SelectItem value="500000-1000000">500,000€ - 1,000,000€</SelectItem>
              <SelectItem value="1000000-999999999">1,000,000€+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="button" variant="outline" onClick={resetFilters}>Réinitialiser les filtres</Button>
        <Button type="submit">Rechercher</Button>
        <Button type="button" variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          {showAdvancedFilters ? 'Masquer les filtres' : 'Plus de filtres'}
        </Button>
      </div>

      {showAdvancedFilters && (
        <div className="space-y-4">
          {filters.type === 'parking' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parkingType">Type de parking</Label>
                <Select name="parkingType" onValueChange={(value) => handleSelectChange('parkingType', value)}>
                  <SelectTrigger id="parkingType">
                    <SelectValue placeholder="Sélectionner un type de parking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indoor">Intérieur</SelectItem>
                    <SelectItem value="outdoor">Extérieur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkingSize">Taille du parking (m²)</Label>
                <Slider
                  id="parkingSize"
                  min={0}
                  max={100}
                  step={1}
                  value={[filters.parkingSize]}
                  onValueChange={(value) => handleSliderChange('parkingSize', value)}
                />
                <div className="text-right text-sm text-muted-foreground">{filters.parkingSize} m²</div>
              </div>
            </div>
          )}

          {filters.type === 'boat' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="boatType">Type de bateau</Label>
                <Select name="boatType" onValueChange={(value) => handleSelectChange('boatType', value)}>
                  <SelectTrigger id="boatType">
                    <SelectValue placeholder="Sélectionner un type de bateau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sailboat">Voilier</SelectItem>
                    <SelectItem value="motorboat">Bateau à moteur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="boatLength">Longueur du bateau (m)</Label>
                <Slider
                  id="boatLength"
                  min={0}
                  max={50}
                  step={0.5}
                  value={[filters.boatLength]}
                  onValueChange={(value) => handleSliderChange('boatLength', value)}
                />
                <div className="text-right text-sm text-muted-foreground">{filters.boatLength} m</div>
              </div>
            </div>
          )}

          {filters.type === 'land' && (
            <div className="space-y-2">
              <Label htmlFor="landArea">Surface du terrain (m²)</Label>
              <Slider
                id="landArea"
                min={0}
                max={10000}
                step={50}
                value={[filters.landArea]}
                onValueChange={(value) => handleSliderChange('landArea', value)}
              />
              <div className="text-right text-sm text-muted-foreground">{filters.landArea} m²</div>
            </div>
          )}

{filters.type === 'residential' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Chambres</Label>
                  <Select name="bedrooms" onValueChange={(value) => handleSelectChange('bedrooms', value)}>
                    <SelectTrigger id="bedrooms">
                      <SelectValue placeholder="Nombre de chambres" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Salles de bain</Label>
                  <Select name="bathrooms" onValueChange={(value) => handleSelectChange('bathrooms', value)}>
                    <SelectTrigger id="bathrooms">
                      <SelectValue placeholder="Nombre de salles de bain" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="livingSpace">Surface habitable (m²)</Label>
                  <Slider
                    id="livingSpace"
                    min={0}
                    max={500}
                    step={10}
                    value={[filters.livingSpace]}
                    onValueChange={(value) => handleSliderChange('livingSpace', value)}
                  />
                  <div className="text-right text-sm text-muted-foreground">{filters.livingSpace} m²</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="builtYear">Année de construction</Label>
                  <Input
                    id="builtYear"
                    name="builtYear"
                    type="number"
                    placeholder="Année de construction"
                    value={filters.builtYear || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floors">Nombre d'étages</Label>
                  <Select name="floors" onValueChange={(value) => handleSelectChange('floors', value)}>
                    <SelectTrigger id="floors">
                      <SelectValue placeholder="Nombre d'étages" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {filters.type === 'commercial' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commercialRooms">Nombre de pièces</Label>
                <Select name="commercialRooms" onValueChange={(value) => handleSelectChange('commercialRooms', value)}>
                  <SelectTrigger id="commercialRooms">
                    <SelectValue placeholder="Nombre de pièces" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commercialSpace">Surface commerciale (m²)</Label>
                <Slider
                  id="commercialSpace"
                  min={0}
                  max={1000}
                  step={50}
                  value={[filters.commercialSpace]}
                  onValueChange={(value) => handleSliderChange('commercialSpace', value)}
                />
                <div className="text-right text-sm text-muted-foreground">{filters.commercialSpace} m²</div>
              </div>
            </div>
          )}
          
        </div>
      )}
    </form>
  )
}

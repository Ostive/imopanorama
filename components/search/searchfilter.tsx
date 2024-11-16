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
    minParkingSize: 0,
    maxParkingSize: 10000,
    boatLength: 0,
    boatType: '',
    minLandArea: 0,
    maxLandArea: 10000,
    bedrooms: 0,
    bathrooms: 0,
    livingSpace: 0,
    builtYear: 0,
    floors: 0,
    commercialRooms: 0,
    commercialSpace: 0,
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      location: '',
      minPrice: 0,
      maxPrice: 1000000,
      parkingType: '',
      minParkingSize: 0,
      maxParkingSize: 10000,
      boatLength: 0,
      boatType: '',
      minLandArea: 0,
      maxLandArea: 10000,
      bedrooms: 0,
      bathrooms: 0,
      livingSpace: 0,
      builtYear: 0,
      floors: 0,
      commercialRooms: 0,
      commercialSpace: 0,
    });
    setShowAdvancedFilters(false);
    onSearch(filters);
  };
  

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onSearch(newFilters)  // Appliquer les filtres immédiatement
  }, [filters, onSearch])

  const handleSelectChange = useCallback((name: string, value: string) => {
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onSearch(newFilters)  // Appliquer les filtres immédiatement
  }, [filters, onSearch])

  const handleSliderChange = useCallback((name: string, value: number[]) => {
    const newFilters = { ...filters, [name]: value[0] }
    setFilters(newFilters)
    onSearch(newFilters)  // Appliquer les filtres immédiatement
  }, [filters, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
          <Select
            name="type"
            value={filters.type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
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
        {/* Prix avec deux inputs */}
        <div className="w-[300px]">
          <Label htmlFor="price-range" className="sr-only">Prix</Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="Prix Min"
                value={filters.minPrice}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0
                  const newFilters = { ...filters, minPrice: value }
                  setFilters(newFilters)
                  onSearch(newFilters)
                }}
                min={0}
                className="pr-6"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
            </div>
            <span>-</span>
            <div className="relative flex-1">
              <Input
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="Prix Max"
                value={filters.maxPrice}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0
                  const newFilters = { ...filters, maxPrice: value }
                  setFilters(newFilters)
                  onSearch(newFilters)
                }}
                min={filters.minPrice}
                className="pr-6"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
            </div>
          </div>
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
              <div className="w-[300px]">
                <Label htmlFor="parking-size" className="sr-only">Taille du parking</Label>
                <Select name="parkingType" onValueChange={(value) => handleSelectChange('parkingType', value)}>
                  <SelectTrigger id="parkingType">
                    <SelectValue placeholder="Sélectionner un type de parking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indoor">Intérieur</SelectItem>
                    <SelectItem value="outdoor">Extérieur</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 space-y-2">
                  <div className="relative flex-1">
                    <Input
                      id="minParkingSize"
                      name="minParkingSize"
                      type="number"
                      placeholder="Taille Min (m²)"
                      value={filters.minParkingSize}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10) || 0;
                        const newFilters = { ...filters, minParkingSize: value };
                        setFilters(newFilters);
                        onSearch(newFilters);  // Appliquer immédiatement les filtres
                      }}
                      min={0}
                      className="pr-6"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">m²</span>
                  </div>
                  <span>-</span>
                  <div className="relative flex-1">
                    <Input
                      id="maxParkingSize"
                      name="maxParkingSize"
                      type="number"
                      placeholder="Taille Max (m²)"
                      value={filters.maxParkingSize}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10) || 0;
                        const newFilters = { ...filters, maxParkingSize: value };
                        setFilters(newFilters);
                        onSearch(newFilters);  // Appliquer immédiatement les filtres
                      }}
                      min={filters.minParkingSize || 0} // Le min est la taille min définie
                      className="pr-6"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">m²</span>
                  </div>
                </div>
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
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                <Input
                  id="minLandArea"
                  name="minLandArea"
                  type="number"
                  placeholder="Surface Min"
                  value={filters.minLandArea || ''} // Affiche une chaîne vide si non défini
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0; // Définit à 0 si la valeur est invalide
                    const newFilters = { ...filters, minLandArea: value };
                    setFilters(newFilters);
                    onSearch(newFilters);
                  }}
                  min={0}
                />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">m²</span>
                </div>
                <span>-</span>
                <div className="relative flex-1">
                <Input
                  id="maxLandArea"
                  name="maxLandArea"
                  type="number"
                  placeholder="Surface Max"
                  value={filters.maxLandArea || ''} // Affiche une chaîne vide si non défini
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    const newFilters = { ...filters, maxLandArea: value };
                    setFilters(newFilters);
                    onSearch(newFilters);
                  }}
                  min={filters.minLandArea}
                />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">m²</span>
                </div>
              </div>
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

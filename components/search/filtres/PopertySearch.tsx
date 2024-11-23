'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import BasicFilters from './BasicFilters'
import ParkingFilters from './ParkingFilters'
import BoatFilters from './BoatFilters'
import LandFilters from './LandFilters'
import ResidentialFilters from './ResidentialFilters'
import CommercialFilters from './CommercialFilters'

export default function PropertySearch({ onSearch }: { onSearch: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    minPrice: 0,
    maxPrice: 1000000,
    parkingType: '',
    minParkingSize: 0,
    maxParkingSize: 1000,
    boatMinLength: 0,
    boatMaxLength: 1000,
    boatType: '',
    minLandArea: 0,
    maxLandArea: 10000,
    bedrooms: 0,
    bathrooms: 0,
    livingSpace: [0,1000],
    builtYear: 0,
    floors: 0,
    commercialRooms: 0,
    commercialSpace: [0,500],
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      type: 'all',
      location: '',
      minPrice: 0,
      maxPrice: 1000000,
      parkingType: '',
      minParkingSize: 0,
      maxParkingSize: 1000,
      boatMinLength: 0,
      boatMaxLength: 1000,
      boatType: '',
      minLandArea: 0,
      maxLandArea: 10000,
      bedrooms: 0,
      bathrooms: 0,
      livingSpace: [0,1000],
      builtYear: 0,
      floors: 0,
      commercialRooms: 0,
      commercialSpace: [0,500],
    });
    setShowAdvancedFilters(false);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-background rounded-lg shadow">
      <BasicFilters filters={filters} onFilterChange={handleFilterChange} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={resetFilters}>Réinitialiser les filtres</Button>
        <Button type="submit">Rechercher</Button>
        <Button type="button" variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          {showAdvancedFilters ? 'Masquer les filtres' : 'Plus de filtres'}
        </Button>
      </div>

      {showAdvancedFilters && (
        <div className="space-y-4">
          {filters.type === 'parking' && <ParkingFilters filters={filters} onFilterChange={handleFilterChange} />}
          {filters.type === 'boat' && <BoatFilters filters={filters} onFilterChange={handleFilterChange} />}
          {filters.type === 'land' && <LandFilters filters={filters} onFilterChange={handleFilterChange} />}
          {filters.type === 'residential' && <ResidentialFilters filters={filters} onFilterChange={handleFilterChange} />}
          {filters.type === 'commercial' && <CommercialFilters filters={filters} onFilterChange={handleFilterChange} />}
        </div>
      )}
    </form>
  )
}

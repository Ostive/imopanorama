import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BasicFilters({ filters, onFilterChange }: { filters: any, onFilterChange: (filters: any) => void }) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-grow min-w-[200px]">
        <Label htmlFor="search" className="sr-only">Recherche générale</Label>
        <Input
          id="search"
          name="search"
          placeholder="Rechercher des propriétés..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      <div className="w-[150px]">
        <Label htmlFor="type" className="sr-only">Type de propriété</Label>
        <Select
          name="type"
          value={filters.type}
          onValueChange={(value) => onFilterChange({ type: value })}
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
          onChange={(e) => onFilterChange({ location: e.target.value })}
        />
      </div>
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
              onChange={(e) => onFilterChange({ minPrice: parseInt(e.target.value, 10) || 0 })}
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
              onChange={(e) => onFilterChange({ maxPrice: parseInt(e.target.value, 10) || 0 })}
              min={filters.minPrice}
              className="pr-6"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
          </div>
        </div>
      </div>
    </div>
  )
}

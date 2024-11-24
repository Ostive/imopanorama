import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ParkingFilters({ filters, onFilterChange }: { filters: any, onFilterChange: (filters: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="w-[300px]">
        <Label htmlFor="parking-size" className="sr-only">Taille du parking</Label>
        <Select 
          name="parkingType" 
          value={filters.parkingType}
          onValueChange={(value) => onFilterChange({ parkingType: value })}
        >
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
              onChange={(e) => onFilterChange({ minParkingSize: parseInt(e.target.value, 10) || 0 })}
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
              onChange={(e) => onFilterChange({ maxParkingSize: parseInt(e.target.value, 10) || 0 })}
              min={filters.minParkingSize || 0}
              className="pr-6"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">m²</span>
          </div>
        </div>
      </div>
    </div>
  )
}


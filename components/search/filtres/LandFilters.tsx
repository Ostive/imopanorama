import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LandFilters({ filters, onFilterChange }: { filters: any, onFilterChange: (filters: any) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="landArea">Surface du terrain (m²)</Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            id="minLandArea"
            name="minLandArea"
            type="number"
            placeholder="Surface Min"
            value={filters.minLandArea || 0}
            onChange={(e) => onFilterChange({ minLandArea: parseInt(e.target.value, 10) || 0 })}
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
            value={filters.maxLandArea || ''}
            onChange={(e) => onFilterChange({ maxLandArea: parseInt(e.target.value, 10) || 0 })}
            min={filters.minLandArea}
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">m²</span>
        </div>
      </div>
    </div>
  )
}


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Sliders from '@radix-ui/react-slider'

export default function ResidentialFilters({ filters, onFilterChange }: { filters: any, onFilterChange: (filters: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Chambres</Label>
          <Select 
            name="bedrooms" 
            value={filters.bedrooms.toString()}
            onValueChange={(value) => onFilterChange({ bedrooms: parseInt(value, 10) })}
          >
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Nombre de chambres" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Salles de bain</Label>
          <Select 
            name="bathrooms" 
            value={filters.bathrooms.toString()}
            onValueChange={(value) => onFilterChange({ bathrooms: parseInt(value, 10) })}
          >
            <SelectTrigger id="bathrooms">
              <SelectValue placeholder="Nombre de salles de bain" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="livingSpace">Surface habitable (m²)</Label>
          <Sliders.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={filters.livingSpace}
            onValueChange={(value) => onFilterChange({ livingSpace: value })}
            min={0}
            max={1000}
            step={10}
            aria-label="Range"
          >
            <Sliders.Track className="bg-slate-200 relative grow rounded-full h-[3px]">
              <Sliders.Range className="absolute bg-slate-900 rounded-full h-full" />
            </Sliders.Track>
            <Sliders.Thumb
              className="block w-5 h-5 bg-white border-2 border-slate-900 rounded-full hover:bg-slate-100 focus:outline-none focus:ring focus:ring-slate-400"
              aria-label="Min value"
            />
            <Sliders.Thumb
              className="block w-5 h-5 bg-white border-2 border-slate-900 rounded-full hover:bg-slate-100 focus:outline-none focus:ring focus:ring-slate-400"
              aria-label="Max value"
            />
          </Sliders.Root>
          <div className="flex justify-between text-sm text-muted-foreground mt-4">
            <span>Min: {filters.livingSpace[0]} m²</span>
            <span>Max: {filters.livingSpace[1]} m²</span>
          </div>
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
            onChange={(e) => onFilterChange({ builtYear: parseInt(e.target.value, 10) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="floors">Nombre d'étages</Label>
          <Select 
            name="floors" 
            value={filters.floors.toString()}
            onValueChange={(value) => onFilterChange({ floors: parseInt(value, 10) })}
          >
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
  )
}


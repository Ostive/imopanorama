import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import * as Sliders from '@radix-ui/react-slider'

export default function CommercialFilters({ filters, onFilterChange }: { filters: any, onFilterChange: (filters: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="commercialRooms">Nombre de pièces</Label>
        <Select 
          name="commercialRooms" 
          value={filters.commercialRooms.toString()}
          onValueChange={(value) => onFilterChange({ commercialRooms: parseInt(value, 10) })}
        >
          <SelectTrigger id="commercialRooms">
            <SelectValue placeholder="Nombre de pièces" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="commercialSpace">Surface commerciale (m²)</Label>
        <Sliders.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={filters.commercialSpace}
            onValueChange={(value) => onFilterChange({ commercialSpace: value })}
            min={0}
            max={500}
            step={5}
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
            <span>Min: {filters.commercialSpace[0]} m²</span>
            <span>Max: {filters.commercialSpace[1]} m²</span>
          </div>
        </div>
    </div>
  )
}


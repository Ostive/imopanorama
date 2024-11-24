import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BoatFilters({ filters, onFilterChange }: { filters: any, onFilterChange: (filters: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="boatType">Type de bateau</Label>
        <Select 
          name="boatType" 
          value={filters.boatType}
          onValueChange={(value) => onFilterChange({ boatType: value })}
        >
          <SelectTrigger id="boatType">
            <SelectValue placeholder="Sélectionner un type de bateau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sailboat">Voilier</SelectItem>
            <SelectItem value="motorboat">Bateau à moteur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 space-y-2">
        <div className="relative flex-1">
          <Input
            id="boatMinLength"
            name="boatMinLength"
            type="number"
            placeholder="Taille Min (m)"
            value={filters.boatMinLength}
            onChange={(e) => onFilterChange({ boatMinLength: parseInt(e.target.value, 10) || 0 })}
            min={0}
            className="pr-6"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">m</span>
        </div>
        <span>-</span>
        <div className="relative flex-1">
          <Input
            id="boatMaxLength"
            name="boatMaxLength"
            type="number"
            placeholder="Taille Max (m)"
            value={filters.boatMaxLength}
            onChange={(e) => onFilterChange({ boatMaxLength: parseInt(e.target.value, 10) || 0 })}
            min={filters.boatMinLength || 0}
            className="pr-6"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">m</span>
        </div>
      </div>
    </div>
  )
}


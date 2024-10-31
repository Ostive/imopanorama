import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Trees, Ruler, Mountain, Waves, Car } from "lucide-react"

interface MadagascarLandPropertyCardProps {
  imageUrl?: string
  price?: string
  address?: string
  area?: number
  zoning?: string
  terrain?: string
  propertyType?: string
  beachProximity?: {
    type: 'direct' | 'near' | 'far'
    distance?: string
  }
  isFavorite?: boolean
  onFavoriteChange?: (newState: boolean) => void
}

export default function MadagascarLandPropertyCard({ 
  imageUrl = "https://images.unsplash.com/photo-1578999766765-31f99c3dd52b?w=500&h=300&fit=crop",
  price = "75 000 000 Ar",
  address = "Plage d'Ambodiatafana, Île Sainte-Marie, Région Analanjirofo, Madagascar",
  area = 2000,
  zoning = "Touristique",
  terrain = "Côtier",
  propertyType = "Terrain",
  beachProximity = { type: 'direct' },
  isFavorite = false,
  onFavoriteChange
}: MadagascarLandPropertyCardProps) {
  const [isLocalFavorite, setIsLocalFavorite] = useState(isFavorite)

  useEffect(() => {
    setIsLocalFavorite(isFavorite)
  }, [isFavorite])

  const renderBeachProximity = () => {
    switch (beachProximity.type) {
      case 'direct':
        return (
          <>
            <Waves className="h-4 w-4 mr-2" />
            <span>Accès direct plage</span>
          </>
        )
      case 'near':
        return (
          <>
            <Car className="h-4 w-4 mr-2" />
            <span>{beachProximity.distance} de la plage</span>
          </>
        )
      case 'far':
        return (
          <>
            <Car className="h-4 w-4 mr-2" />
            <span>Plage éloignée ({beachProximity.distance})</span>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card className="max-w-sm mx-auto overflow-hidden">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt="Terrain à Madagascar" 
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          {propertyType}
        </Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute top-2 right-2 rounded-full p-2 ${
            isLocalFavorite ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
          } transition-colors`}
          aria-label={isLocalFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={() => {
            const newState = !isLocalFavorite
            setIsLocalFavorite(newState)
            onFavoriteChange?.(newState)
          }}
        >
          <Heart className={`h-5 w-5 ${
            isLocalFavorite ? 'text-red-500 fill-red-500' : 'text-primary'
          }`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="text-2xl font-bold text-primary mb-2">{price}</h3>
        <p className="text-muted-foreground flex items-start mb-4 text-sm">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-1" />
          <span className="line-clamp-2">{address}</span>
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="col-span-2 bg-secondary rounded-lg p-2 flex items-center justify-between">
            <span className="flex items-center text-secondary-foreground">
              <Ruler className="h-4 w-4 mr-2" />
              Superficie
            </span>
            <span className="font-semibold text-primary">{area} m²</span>
          </div>
          <div className="col-span-2 bg-secondary rounded-lg p-2 flex items-center justify-between">
            <span className="flex items-center text-secondary-foreground">
              <Trees className="h-4 w-4 mr-2" />
              Zonage
            </span>
            <span className="font-semibold text-primary">{zoning}</span>
          </div>
          <div className="col-span-2 bg-secondary rounded-lg p-2 flex items-center justify-between">
            <span className="flex items-center text-secondary-foreground">
              <Mountain className="h-4 w-4 mr-2" />
              Terrain
            </span>
            <span className="font-semibold text-primary">{terrain}</span>
          </div>
          <div className="col-span-2 bg-secondary rounded-lg p-2 flex items-center justify-between">
            <span className="flex items-center text-secondary-foreground">
              {renderBeachProximity()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary">
        <Button className="w-full">Voir les détails</Button>
      </CardFooter>
    </Card>
  )
}

export { MadagascarLandPropertyCard };
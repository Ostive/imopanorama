import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Home, Key, Calculator, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Component() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="buy" className="gap-2">
              <Home className="w-4 h-4" />
              Acheter
            </TabsTrigger>
            <TabsTrigger value="rent" className="gap-2">
              <Key className="w-4 h-4" />
              Louer
            </TabsTrigger>
            <TabsTrigger value="estimate" className="gap-2">
              <Calculator className="w-4 h-4" />
              Estimer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                className="w-full pl-10" 
                placeholder="Saisir le lieu ou le code postal"
              />
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href="/acheter" className="flex items-center justify-center gap-2">
                Rechercher
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </TabsContent>

          <TabsContent value="rent" className="space-y-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                className="w-full pl-10" 
                placeholder="Saisir le lieu ou le code postal"
              />
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href="/louer" className="flex items-center justify-center gap-2">
                Rechercher
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </TabsContent>

          <TabsContent value="estimate" className="space-y-6">
            <h2 className="text-xl font-medium text-center">
              Estimer gratuitement votre bien et découvrez sa valeur en moins de 2 minutes
            </h2>
            <Button asChild size="lg" className="w-full">
              <Link href="/estimer" className="flex items-center justify-center gap-2">
                Estimer votre bien
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
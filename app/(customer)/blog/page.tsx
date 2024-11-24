import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Données factices pour les articles
const articles = [
  {
    id: 1,
    title: "L'avenir de l'intelligence artificielle",
    excerpt: "Découvrez les dernières avancées en IA et leur impact sur notre société.",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "10 astuces pour un code plus propre",
    excerpt: "Améliorez la qualité de votre code avec ces conseils simples mais efficaces.",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Le guide ultime du développeur full-stack",
    excerpt: "Tout ce que vous devez savoir pour devenir un développeur full-stack compétent.",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Sécurité web : les meilleures pratiques",
    excerpt: "Protégez vos applications web contre les menaces les plus courantes.",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]

export default function ArticlesGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Articles récents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="flex flex-col">
            <CardHeader className="p-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
              <p className="text-muted-foreground">{article.excerpt}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Lire plus
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">ImoPanorama</h2>
            <p className="mb-4">Votre partenaire de confiance pour trouver la propriété de vos rêves.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/acheter" className="hover:text-blue-600 transition-colors">Acheter</Link></li>
              <li><Link href="/vendre" className="hover:text-blue-600 transition-colors">Vendre</Link></li>
              <li><Link href="/louer" className="hover:text-blue-600 transition-colors">Louer</Link></li>
              <li><Link href="/estimation" className="hover:text-blue-600 transition-colors">Estimation gratuite</Link></li>
              <li><Link href="/a-propos" className="hover:text-blue-600 transition-colors">À propos de nous</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>123 Rue de l'Immobilier, 75000 Paris</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <a href="tel:+33123456789" className="hover:text-blue-600 transition-colors">+33 1 23 45 67 89</a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a href="mailto:contact@imopanorama.fr" className="hover:text-blue-600 transition-colors">contact@imopanorama.fr</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="mb-4">Restez informé de nos dernières offres</p>
            <form className="space-y-2">
              <Input type="email" placeholder="Votre email" className="w-full" />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">S'abonner</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 ImoPanorama. Tous droits réservés.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
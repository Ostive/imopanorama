'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from 'lucide-react'
import Image from "next/image"
import Link from "next/link" // Importation de Link
import { useState, useEffect } from "react"

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (par exemple, via un token ou un état global)
    const user = localStorage.getItem('user')  // Exemple d'utilisation de localStorage
    if (user) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    // Gérer la déconnexion, par exemple en supprimant le token ou les informations de l'utilisateur
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    window.location.href = '/'  // Redirection vers la page d'accueil après déconnexion
  }

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-white shadow-md">
      <Link href="/">
        <div className="flex items-center">
          <Image
            src="/images/immopanoramanobg.png"
            alt="Logo"
            width={100}
            height={100}
            className="mr-2"
          />
          <span className="text-xl font-bold">IMMOPANORAMA</span>
        </div>
      </Link>

      {/* Affichage conditionnel du bouton Connexion ou Déconnexion */}
      {isAuthenticated ? (
        <Button variant="outline" onClick={handleLogout}>
          Déconnexion
        </Button>
      ) : (
        <Link href="/sign-in">
          <Button variant="outline">Connexion</Button>
        </Link>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Paramètres</DropdownMenuItem>
          <DropdownMenuItem>Aide</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

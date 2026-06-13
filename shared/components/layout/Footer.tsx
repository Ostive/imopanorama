'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchWithTimeout } from '@/shared/utils/fetchWithTimeout'
import { m } from 'framer-motion'
import NewsletterForm from '@/shared/components/layout/NewsletterForm'
import { useTheme } from '@/shared/theme/ThemeContext'
import { useState, useEffect } from 'react'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface ContactSettings {
  city: string;
  country: string;
  phone: string;
  email: string;
  workingHours: string;
  responseTime: string;
  facebook: string;
  facebookEnabled: boolean;
  instagram: string;
  instagramEnabled: boolean;
  linkedin: string;
  linkedinEnabled: boolean;
  twitter: string;
  twitterEnabled: boolean;
  youtube: string;
  youtubeEnabled: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function FooterSocialLinks({ settings }: { settings: ContactSettings }) {
  return (
    <div className="flex space-x-3">
      {settings.facebookEnabled && settings.facebook && (
        <m.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={settings.facebook} target="_blank" rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </m.a>
      )}
      {settings.instagramEnabled && settings.instagram && (
        <m.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={settings.instagram} target="_blank" rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </m.a>
      )}
      {settings.linkedinEnabled && settings.linkedin && (
        <m.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={settings.linkedin} target="_blank" rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </m.a>
      )}
      {settings.twitterEnabled && settings.twitter && (
        <m.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={settings.twitter} target="_blank" rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </m.a>
      )}
      {settings.youtubeEnabled && settings.youtube && (
        <m.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={settings.youtube} target="_blank" rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </m.a>
      )}
    </div>
  )
}

function Footer() {
  const currentYear = new Date().getFullYear()
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    city: 'Antananarivo',
    country: 'Madagascar',
    phone: '+261 34 XX XX XX XX',
    email: 'contact@imopanorama.mg',
    workingHours: 'Lun-Ven: 8h-17h',
    responseTime: 'Réponse sous 24h',
    facebook: '',
    facebookEnabled: false,
    instagram: '',
    instagramEnabled: false,
    linkedin: '',
    linkedinEnabled: false,
    twitter: '',
    twitterEnabled: false,
    youtube: '',
    youtubeEnabled: false,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetchWithTimeout('/api/settings', {}, 5000)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.settings?.contact) {
            setContactSettings(data.settings.contact)
          }
        }
      } catch {
        // Silently fail (timeout or network error) — keep default settings
      }
    }

    fetchSettings()
  }, [])
  
  return (
    <footer className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <m.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-12"
        >
          {/* Company Info */}
          <m.div variants={itemVariants} className="space-y-6">
            <div>
              <Link href="/">
                <Image
                  src="/images/brand/logo.png"
                  alt="ImoPanorama Madagascar"
                  width={320}
                  height={96}
                  className="h-24 w-auto object-contain brightness-0 invert"
                />
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Des biens à découvrir, des conseils honnêtes et un accompagnement humain pour acheter, louer ou construire à Madagascar.
            </p>
            <FooterSocialLinks settings={contactSettings} />
          </m.div>

          {/* Quick Links */}
          <m.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-white">Accès rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="group flex items-center text-gray-300 hover:text-primary-400 transition-colors">
                  <ArrowRightIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/proprietes" className="group flex items-center text-gray-300 hover:text-primary-400 transition-colors">
                  <ArrowRightIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Tous les biens
                </Link>
              </li>
              <li>
                <Link href="/batipanorama" className="group flex items-center text-gray-300 hover:text-primary-400 transition-colors">
                  <ArrowRightIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  BatiPanorama
                </Link>
              </li>
              <li>
                <Link href="/vendre" className="group flex items-center text-gray-300 hover:text-primary-400 transition-colors">
                  <ArrowRightIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Vendre un bien
                </Link>
              </li>
              <li>
                <Link href="/estimation" className="group flex items-center text-gray-300 hover:text-primary-400 transition-colors">
                  <ArrowRightIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Estimer mon bien
                </Link>
              </li>
              <li>
                <Link href="/services" className="group flex items-center text-gray-300 hover:text-primary-400 transition-colors">
                  <ArrowRightIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Nos services
                </Link>
              </li>
              <li>
                <Link href="/calculateur-budget" className="group flex items-center text-gray-300 hover:text-primary-400 transition-colors">
                  <ArrowRightIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Calculateur budget
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="group flex items-center text-gray-300 hover:text-primary-400 transition-colors">
                  <ArrowRightIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Actualités
                </Link>
              </li>
            </ul>
          </m.div>

          {/* Services */}
          <m.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-white">Services</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">•</span>
                <span>Achat et vente de biens</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">•</span>
                <span>Conseils pour votre projet</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">•</span>
                <span>Construction avec suivi</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">•</span>
                <span>Accompagnement administratif</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">•</span>
                <Link href="/temoignages" className="hover:text-primary-400 transition-colors">
                  Témoignages clients
                </Link>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">•</span>
                <Link href="/guide-achat" className="hover:text-primary-400 transition-colors">
                  Guide achat
                </Link>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">•</span>
                <Link href="/guide-location" className="hover:text-primary-400 transition-colors">
                  Guide location
                </Link>
              </li>
            </ul>
          </m.div>

          {/* Contact Info */}
          <m.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                  <MapPinIcon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">{contactSettings.city}</p>
                  <p className="text-xs text-gray-400">{contactSettings.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                  <PhoneIcon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">{contactSettings.phone}</p>
                  <p className="text-xs text-gray-400">{contactSettings.workingHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                  <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">{contactSettings.email}</p>
                  <p className="text-xs text-gray-400">{contactSettings.responseTime}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="mb-2 text-sm font-bold text-white">Newsletter</p>
                <p className="mb-3 text-xs text-gray-400">Recevez nos nouveaux biens et conseils.</p>
                <NewsletterForm />
              </div>
            </div>
          </m.div>
        </m.div>

        {/* Bottom Bar */}
        <m.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p className="mb-4 md:mb-0">&copy; {currentYear} ImoPanorama Madagascar. Tous droits réservés.</p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/mentions-legales" className="hover:text-primary-400 transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="hover:text-primary-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/cgu" className="hover:text-primary-400 transition-colors">
                CGU
              </Link>
              <Link href="/contact" className="hover:text-primary-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </m.div>
      </div>
    </footer>
  )
}

// Footer rarely changes, memoize to prevent re-renders on route changes
export default React.memo(Footer)

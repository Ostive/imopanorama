'use client'

import Link from 'next/link';
import { ArrowLeftIcon, BuildingOffice2Icon, EnvelopeIcon, PhoneIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { m } from 'framer-motion';

const LAST_UPDATED_LABEL = '9 juin 2026';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Navigation */}
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary-600 transition-colors font-medium text-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-primary-200 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-all">
              <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            Retour à l'accueil
          </Link>
        </m.div>

        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight mb-6">
            Mentions <span className="text-primary-600">Légales</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transparence et confiance sont au cœur de nos engagements. Retrouvez ici toutes les informations légales concernant Imopanorama.
          </p>
        </m.div>

        {/* Content Card */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 dark:border-border p-6 md:p-12 overflow-hidden relative"
        >
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary-500 via-primary-500 to-primary-500" />

          <div className="space-y-12">

            {/* Éditeur */}
            <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
              <div className="bg-primary-50/50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100/50 dark:border-primary-900/30">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                  <BuildingOffice2Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Éditeur du site</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  L'entité responsable de la publication et du contenu de ce site.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoItem label="Raison sociale" value="Imopanorama Madagascar" />
                  <InfoItem label="Forme juridique" value="SARL" />
                  <InfoItem label="Capital social" value="2 000 000 MGA" />
                  <InfoItem label="Siège social" value="Vohila Sainte Marie, Madagascar" />
                  <InfoItem label="NIF" value="4001857078" />
                  <InfoItem label="STAT" value="41001 32 2015 0 00008" />
                  <InfoItem label="RCS" value="RCS FEN.A 2022 A 00008" />
                </div>
              </div>
            </div>

            <Divider />

            {/* Directeur */}
            <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
              <div className="bg-primary-50/50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100/50 dark:border-primary-900/30">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Responsable</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  La personne physique ou morale responsable de la publication.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoItem label="Directrice de publication" value="Apicella Arisonia" />
                  <InfoItem label="Fonction" value="Gérante" />
                  <InfoItem label="Contact éditorial" value="imopananorama@gmail.com" />
                </div>
              </div>
            </div>

            <Divider />

            {/* Hébergement */}
            <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
              <div className="bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100/50 dark:border-border/50">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4 text-muted-foreground">
                  <GlobeAltIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Hébergement</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Infrastructure technique assurant la disponibilité du site.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                <div className="grid sm:grid-cols-1 gap-4">
                  <InfoItem label="Hébergeur" value="Vercel Inc." />
                  <InfoItem label="Adresse" value="340 S Lemon Ave #4133, Walnut, CA 91789, USA" />
                  <InfoItem label="Site web" value="https://vercel.com" link />
                </div>
              </div>
            </div>

            <Divider />

            {/* Contact */}
            <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
              <div className="bg-green-50/50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100/50 dark:border-green-900/30">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Nous contacter</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pour toute question ou réclamation concernant le site.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                <div className="bg-muted/50 rounded-xl p-5 border border-border flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary-600">
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</span>
                      <a href="mailto:imopanorama@gmail.com" className="text-foreground font-medium hover:text-primary-600 transition-colors">imopanorama@gmail.com</a>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-muted hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary-600">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Téléphone</span>
                      <span className="text-foreground font-medium">+261 32 21 93 995</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic mt-4">
                  Nos équipes sont disponibles du lundi au vendredi, de 8h à 18h.
                </p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              Dernière mise à jour : {LAST_UPDATED_LABEL}
            </p>
            <div className="flex gap-4">
              <Link href="/cgu" className="text-sm text-muted-foreground hover:text-primary-600 transition-colors font-medium">Conditions Générales</Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link href="/politique-confidentialite" className="text-sm text-muted-foreground hover:text-primary-600 transition-colors font-medium">Confidentialité</Link>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, link = false }: { label: string, value: string, link?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-muted-foreground mb-1">{label}</span>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-primary-600 hover:underline">
          {value}
        </a>
      ) : (
        <span className="text-base font-medium text-foreground">{value}</span>
      )}
    </div>
  );
}

function Divider() {
  return <div className="w-full h-px bg-muted my-8" />;
}

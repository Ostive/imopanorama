'use client'

import Link from 'next/link';
import { ArrowLeftIcon, DocumentCheckIcon, ExclamationTriangleIcon, ScaleIcon, ShieldCheckIcon, UserIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium text-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-primary-200 group-hover:bg-primary-50 transition-all">
              <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            Retour à l'accueil
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Conditions <span className="text-primary-600">Générales</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Règles d'utilisation du site ImoPanorama. Veuillez les lire attentivement.
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 p-6 md:p-12 overflow-hidden relative"
        >
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary-500 via-blue-500 to-primary-500" />

          {/* Intro Section */}
          <div className="mb-12 p-6 bg-primary-50/50 rounded-2xl border border-primary-100/50">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <DocumentCheckIcon className="w-5 h-5 text-primary-600" />
              1. Objet
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du
              site web ImoPanorama Madagascar accessible à l'adresse imopanorama.mg. En accédant
              et en utilisant ce site, vous acceptez sans réserve les présentes CGU.
            </p>
          </div>

          <div className="space-y-12 text-gray-600 leading-relaxed">

            <Section title="2. Définitions" icon={<ScaleIcon className="w-6 h-6" />}>
              <ul className="grid sm:grid-cols-2 gap-4">
                <DefinitionTerm term="Site" definition="Le site web ImoPanorama accessible à imopanorama.mg" />
                <DefinitionTerm term="Utilisateur" definition="Toute personne qui accède et utilise le Site" />
                <DefinitionTerm term="Éditeur" definition="ImoPanorama Madagascar" />
                <DefinitionTerm term="Services" definition="Fonctionnalités et contenus proposés" />
              </ul>
            </Section>

            <Divider />

            <Section title="3. Accès & Disponibilité" icon={<GlobeAltIcon className="w-6 h-6" />}>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">3.1 Accès libre</h4>
                  <p>L'accès au Site est gratuit et libre. Certaines fonctionnalités peuvent nécessiter un compte.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">3.2 Disponibilité 24/7</h4>
                  <p>Accessible sauf force majeure ou maintenance. L'Éditeur n'est pas responsable des interruptions temporaires.</p>
                </div>
              </div>
            </Section>

            <Divider />

            <Section title="4. Compte Utilisateur" icon={<UserIcon className="w-6 h-6" />}>
              <p className="mb-4">La création d'un compte permet d'accéder aux favoris et alertes.</p>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Responsabilités</h4>
                <ul className="space-y-2 list-disc list-inside text-gray-600">
                  <li>Fournir des informations exactes.</li>
                  <li>Maintenir la confidentialité des identifiants.</li>
                  <li>Signaler toute utilisation non autorisée.</li>
                </ul>
              </div>
            </Section>

            <Divider />

            <Section title="5. Obligations" icon={<ExclamationTriangleIcon className="w-6 h-6" />}>
              <p className="mb-4">L'Utilisateur s'engage à :</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <CheckItem text="Utiliser le site conformément à sa destination" />
                <CheckItem text="Ne pas diffuser de contenu illicite" />
                <CheckItem text="Ne pas tenter de piratage ou d'accès non autorisé" />
                <CheckItem text="Respecter la propriété intellectuelle" />
              </div>
            </Section>

            <Divider />

            <Section title="6. Propriété Intellectuelle" icon={<ShieldCheckIcon className="w-6 h-6" />}>
              <p>
                Tout le contenu (textes, images, code) est la propriété exclusive d'ImoPanorama.
                Toute reproduction sans autorisation est une contrefaçon sanctionnée par la loi.
              </p>
            </Section>

          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 font-medium">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <Link href="/mentions-legales" className="text-sm text-gray-500 hover:text-primary-600 transition-colors font-medium">Mentions Légales</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary-600">
          {icon}
        </div>
        {title}
      </h2>
      <div className="pl-0 md:pl-[52px]">
        {children}
      </div>
    </section>
  );
}

function DefinitionTerm({ term, definition }: { term: string, definition: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <span className="block font-bold text-gray-900 mb-1">{term}</span>
      <span className="text-sm text-gray-600">{definition}</span>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <span className="text-gray-600 font-medium">{text}</span>
    </div>
  );
}

function Divider() {
  return <div className="w-full h-px bg-gray-100 my-8" />;
}

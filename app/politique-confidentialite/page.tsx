'use client'

import Link from 'next/link';
import { ArrowLeftIcon, ShieldCheckIcon, EyeIcon, LockClosedIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function PolitiqueConfidentialitePage() {
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
            Politique de <span className="text-primary-600">Confidentialité</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Votre vie privée est essentielle. Découvrez comment nous protégeons et traitons vos données.
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
          <div className="mb-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
            <ShieldCheckIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
              ImoPanorama Madagascar s'engage à protéger la vie privée de ses utilisateurs.
              En utilisant notre site, vous acceptez les pratiques décrites dans cette politique.
            </p>
          </div>

          <div className="space-y-12 text-gray-600 leading-relaxed">

            {/* Données Collectées */}
            <Section title="1. Données collectées" icon={<DocumentTextIcon className="w-6 h-6" />}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider text-primary-600">Données fournies</h4>
                  <ul className="space-y-2 text-sm">
                    <ListItem text="Compte : Nom, email, téléphone" />
                    <ListItem text="Contact : Messages formulaires" />
                    <ListItem text="Transaction : Favoris, recherches" />
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider text-blue-600">Données automatiques</h4>
                  <ul className="space-y-2 text-sm">
                    <ListItem text="Navigation : Pages, durée, clics" />
                    <ListItem text="Technique : IP, navigateur" />
                    <ListItem text="Cookies & Localisation approx." />
                  </ul>
                </div>
              </div>
            </Section>

            <Divider />

            {/* Utilisation */}
            <Section title="2. Utilisation des données" icon={<EyeIcon className="w-6 h-6" />}>
              <p className="mb-6">Nous utilisons vos données principalement pour :</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <CheckItem text="Gérer votre compte et vos accès" />
                <CheckItem text="Répondre à vos demandes de contact" />
                <CheckItem text="Personnaliser votre expérience" />
                <CheckItem text="Améliorer nos services et la sécurité" />
                <CheckItem text="Analyses statistiques anonymes" />
                <CheckItem text="Newsletter (avec consentement)" />
              </div>
            </Section>

            <Divider />

            {/* Partage */}
            <Section title="3. Partage des données" icon={<UserGroupIcon className="w-6 h-6" />}>
              <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 prose prose-yellow text-gray-700">
                <p className="font-medium text-yellow-800 mb-2">Notice importante :</p>
                <p className="m-0">
                  Nous ne vendons <strong>jamais</strong> vos données personnelles. Le partage est strictement limité à :
                </p>
                <ul className="mt-2 list-disc list-inside">
                  <li><strong>BatiPanorama :</strong> notre partenaire construction (si pertinent).</li>
                  <li><strong>Prestataires techniques :</strong> hébergement, emailing (sous confidentialité).</li>
                  <li><strong>Obligations légales :</strong> si requis par la loi.</li>
                </ul>
              </div>
            </Section>

            <Divider />

            {/* Sécurité */}
            <Section title="4. Sécurité" icon={<LockClosedIcon className="w-6 h-6" />}>
              <p>
                Mesures strictes incluant : chiffrement SSL/TLS, accès restreints, et audit régulier.
                Bien que nous visions une sécurité absolue, aucun système n'est infaillible sur Internet.
              </p>
            </Section>

            <Divider />

            {/* Vos Droits */}
            <Section title="5. Vos Droits" icon={<ShieldCheckIcon className="w-6 h-6" />}>
              <p className="mb-6">Vous avez le contrôle total sur vos données :</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <RightCard title="Accès" desc="Demander une copie de vos données." />
                <RightCard title="Rectification" desc="Corriger des données inexactes." />
                <RightCard title="Effacement" desc="Demander la suppression définitive." />
                <RightCard title="Opposition" desc="Refuser l'usage marketing." />
                <RightCard title="Portabilité" desc="Récupérer vos données structurées." />
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Pour exercer ces droits : <a href="mailto:contact@imopanorama.mg" className="text-primary-600 font-medium hover:underline">contact@imopanorama.mg</a>
              </p>
            </Section>

          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 font-medium">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="flex gap-4">
              <Link href="/mentions-legales" className="text-sm text-gray-500 hover:text-primary-600 transition-colors font-medium">Mentions Légales</Link>
              <span className="text-gray-300">•</span>
              <Link href="/cgu" className="text-sm text-gray-500 hover:text-primary-600 transition-colors font-medium">CGU</Link>
            </div>
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

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-gray-600">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
      {text}
    </li>
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

function RightCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

function Divider() {
  return <div className="w-full h-px bg-gray-100 my-8" />;
}

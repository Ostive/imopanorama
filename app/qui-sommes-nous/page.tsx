'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeftIcon, 
  BuildingOffice2Icon, 
  UserGroupIcon, 
  SparklesIcon,
  CheckCircleIcon,
  HeartIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function QuiSommesNousPage() {
  const values = [
    {
      icon: HeartIcon,
      title: 'Passion',
      description: 'Nous sommes passionnés par l\'immobilier et le développement de Madagascar.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Confiance',
      description: 'La transparence et l\'honnêteté sont au cœur de nos relations clients.',
      color: 'from-primary-500 to-cyan-500'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'Nous utilisons les dernières technologies pour faciliter votre recherche.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Accompagnement',
      description: 'Un suivi personnalisé à chaque étape de votre projet immobilier.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: '500+', label: 'Terrains disponibles' },
    { value: '1000+', label: 'Clients satisfaits' },
    { value: '10+', label: 'Années d\'expérience' },
    { value: '100%', label: 'Engagement qualité' }
  ];

  const team = [
    {
      name: 'Direction Générale',
      role: 'Leadership & Stratégie',
      description: 'Pilotage de la vision et du développement d\'ImoPanorama'
    },
    {
      name: 'Équipe Commerciale',
      role: 'Vente & Conseil',
      description: 'Accompagnement personnalisé dans votre recherche de terrain'
    },
    {
      name: 'Équipe Juridique',
      role: 'Sécurité & Conformité',
      description: 'Garantie de la légalité et sécurité de vos transactions'
    },
    {
      name: 'Équipe Technique',
      role: 'Innovation & Support',
      description: 'Développement de solutions digitales pour votre confort'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/30">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-primary-600 to-primary-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4" />
              <span>Votre partenaire immobilier de confiance</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Qui sommes-nous ?
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              ImoPanorama, votre expert immobilier à Madagascar depuis plus de 10 ans
            </p>
          </motion.div>
        </div>
      </div>

      {/* Notre Histoire */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                  alt="Bureau ImoPanorama"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                <BuildingOffice2Icon className="w-4 h-4" />
                <span>Notre Histoire</span>
              </div>

              <h2 className="text-4xl font-bold text-foreground">
                Une passion pour l'immobilier malgache
              </h2>

              <div className="space-y-4 text-foreground leading-relaxed">
                <p>
                  Fondée il y a plus de 10 ans, <strong>ImoPanorama</strong> est née d'une vision simple : 
                  faciliter l'accès à la propriété foncière à Madagascar et accompagner chaque client 
                  dans la réalisation de son projet immobilier.
                </p>
                <p>
                  Spécialisés dans la vente de terrains, nous avons développé une expertise unique 
                  du marché malgache et tissé des partenariats solides pour offrir un service complet, 
                  de l'acquisition du terrain jusqu'à la construction avec notre partenaire 
                  <strong> BatiPanorama</strong>.
                </p>
                <p>
                  Aujourd'hui, avec plus de <strong>500 terrains disponibles</strong> et 
                  <strong> 1000 clients satisfaits</strong>, nous continuons d'innover pour vous 
                  offrir la meilleure expérience immobilière possible.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                  <CheckCircleIcon className="h-6 w-6" />
                  <span className="font-semibold">Terrains certifiés</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                  <CheckCircleIcon className="h-6 w-6" />
                  <span className="font-semibold">Accompagnement complet</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                  <CheckCircleIcon className="h-6 w-6" />
                  <span className="font-semibold">Prix transparents</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-20 bg-linear-to-r from-primary-600 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
              <SparklesIcon className="w-4 h-4" />
              <span>Nos Valeurs</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ce qui nous guide au quotidien
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des principes forts qui définissent notre approche et notre engagement envers vous
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className={`w-16 h-16 bg-linear-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
              <UserGroupIcon className="w-4 h-4" />
              <span>Notre Équipe</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Des experts à votre service
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une équipe pluridisciplinaire dédiée à la réussite de votre projet
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-primary-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 text-center">{member.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mb-3 text-center">{member.role}</p>
                <p className="text-muted-foreground text-sm text-center leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Partenaire */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-primary-600 to-primary-600 rounded-3xl p-12 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>Notre Partenaire</span>
                </div>
                
                <h2 className="text-4xl font-bold mb-6">
                  BatiPanorama
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  En partenariat avec <strong>BatiPanorama</strong>, nous vous offrons un service 
                  complet de construction. Du terrain à la maison clé en main, nous vous accompagnons 
                  dans toutes les étapes de votre projet immobilier.
                </p>
                
                <Link 
                  href="/batipanorama"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-white/90 transition-all"
                >
                  Découvrir BatiPanorama
                  <ArrowLeftIcon className="h-5 w-5 rotate-180" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <CheckCircleIcon className="h-8 w-8 text-white mb-3" />
                  <h3 className="text-xl font-bold mb-2">Construction sur mesure</h3>
                  <p className="text-white/80">Plans personnalisés selon vos besoins et votre budget</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <CheckCircleIcon className="h-8 w-8 text-white mb-3" />
                  <h3 className="text-xl font-bold mb-2">Qualité garantie</h3>
                  <p className="text-white/80">Matériaux de qualité et respect des normes</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <CheckCircleIcon className="h-8 w-8 text-white mb-3" />
                  <h3 className="text-xl font-bold mb-2">Suivi de chantier</h3>
                  <p className="text-white/80">Accompagnement et transparence à chaque étape</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-background/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Prêt à concrétiser votre projet ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Découvrez nos terrains disponibles ou contactez-nous pour un accompagnement personnalisé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/proprietes"
                className="inline-flex items-center justify-center px-8 py-4 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all hover:scale-105"
              >
                Voir nos propriétés
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-card border-2 border-border hover:border-gray-400 dark:hover:border-gray-500 text-foreground font-semibold rounded-xl transition-all hover:scale-105"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

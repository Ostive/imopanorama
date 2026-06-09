'use client';

import { useQuery } from '@tanstack/react-query';
import { Project, ProcessStep, Service } from '@/features/batipanorama/types/batipanorama.types';
import { NewsItem } from '@/features/news/types/news.types';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import LogoMarquee from '@/shared/components/sections/LogoMarquee';
import {
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function BatiPanoramaPage() {
  const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
    queryKey: ['bati-projects'],
    queryFn: async () => {
      const response = await fetch('/api/bati-projects');
      const data = await response.json();
      if (data.success) return data.projects.filter((p: Project) => p.status === 'COMPLETED').slice(0, 3);
      return [];
    },
  });

  const { data: processSteps = [], isLoading: isProcessLoading } = useQuery({
    queryKey: ['bati-process'],
    queryFn: async () => {
      const response = await fetch('/api/bati-process');
      const data = await response.json();
      if (data.success) return data.steps.sort((a: ProcessStep, b: ProcessStep) => a.step - b.step);
      return [];
    },
  });

  const { data: services = [], isLoading: isServicesLoading } = useQuery({
    queryKey: ['bati-services'],
    queryFn: async () => {
      const response = await fetch('/api/bati-services');
      const data = await response.json();
      if (data.success) return data.services.filter((s: Service) => s.isActive).sort((a: Service, b: Service) => a.order - b.order);
      return [];
    },
  });

  const { data: recentNews = [], isLoading: isNewsLoading } = useQuery({
    queryKey: ['recent-news-construction'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/news?category=CONSTRUCTION&limit=3');
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
      } catch {
        return [
          { id: '1', title: 'Un nouveau projet prend forme à Antananarivo', slug: 'nouveau-projet-immobilier-antananarivo', excerpt: "Un projet pensé pour répondre aux besoins du quartier d'Ankadimbahoaka.", coverImage: '/images/news/news-1.jpg', category: 'IMMOBILIER', publishedAt: new Date().toISOString(), author: { id: '1', firstName: 'Jean', lastName: 'Dupont' } },
          { id: '2', title: 'Notre nouveau bureau ouvre ses portes', slug: 'inauguration-nouveau-bureau', excerpt: "Un nouvel espace pour accueillir et accompagner nos clients à Toamasina.", coverImage: '/images/news/news-2.jpg', category: 'ENTREPRISE', publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(), author: { id: '2', firstName: 'Marie', lastName: 'Martin' } },
          { id: '3', title: "Retrouvons-nous au Salon de l'immobilier", slug: 'salon-immobilier-2025', excerpt: 'Venez échanger avec nous autour de vos projets immobiliers et construction.', coverImage: '/images/news/news-3.jpg', category: 'EVENEMENT', publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(), author: { id: '1', firstName: 'Jean', lastName: 'Dupont' } },
        ];
      }
    },
  });

  const categoryLabel: Record<string, string> = {
    IMMOBILIER: 'Immobilier', CONSTRUCTION: 'Construction', EVENEMENT: 'Événement', ENTREPRISE: 'Entreprise', GENERAL: 'Général',
  };

  return (
    <div className="min-h-screen">

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-background py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(14_165_233/0.07)_1px,transparent_0)] bg-size-[28px_28px] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100/60 dark:bg-primary-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary-100/40 dark:bg-secondary-900/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px w-12 bg-primary-500" />
            <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <SparklesIcon className="w-3.5 h-3.5" />
              BatiPanorama depuis 2015
            </span>
          </m.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <m.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-6xl lg:text-7xl font-black text-foreground leading-[1.0] mb-6">
                Construisez avec une équipe qui{' '}
                <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  suit vraiment
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
                Villas, piscines, extensions ou projets professionnels : BatiPanorama vous accompagne avec méthode, écoute et exigence, du premier croquis à la livraison.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href="/batipanorama/contact" className="group inline-flex items-center justify-center gap-2 px-7 py-4 font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl">
                  <EnvelopeIcon className="w-5 h-5" />
                  Parler de mon projet
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/batipanorama/projets" className="inline-flex items-center justify-center gap-2 px-7 py-4 font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all">
                  <BuildingOffice2Icon className="w-5 h-5" />
                  Voir les projets réalisés
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                {[
                  { value: '10+', label: "années sur le terrain", color: 'text-primary-600 dark:text-primary-400' },
                  { value: '200+', label: 'projets livrés', color: 'text-primary-600 dark:text-primary-400' },
                  { value: '98%', label: 'clients accompagnés', color: 'text-secondary-600 dark:text-secondary-400' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </m.div>

            <m.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/images/social/og-image.png" alt="Construction BatiPanorama" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/40 to-transparent" />
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* ─── Services ──────────────────────────────────────────────── */}
      <section className="py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <m.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-12 bg-primary-500" />
                <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">Ce que l'on construit</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-foreground leading-[1.05]">
                Des projets pensés pour{' '}
                <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">durer</span>
              </h2>
            </m.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {isServicesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-background rounded-3xl p-8 animate-pulse">
                    <div className="w-14 h-14 bg-muted rounded-2xl mb-5" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                    <div className="space-y-2 mb-5">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                  </div>
                ))
              : services.map((service: Service, index: number) => (
                  <m.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="group bg-background rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-5 text-sm">{service.description}</p>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature: string) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                          <CheckCircleIcon className="w-4 h-4 text-secondary-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href="/batipanorama/contact" className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider group-hover:gap-3 transition-all">
                      En savoir plus
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </m.div>
                ))}
          </div>
        </div>
      </section>

      {/* ─── Process ───────────────────────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <m.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-12 bg-primary-500" />
              <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">Notre façon de travailler</span>
              <div className="h-px w-12 bg-primary-500" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-foreground leading-[1.05]">
              De l'idée jusqu'à la{' '}
              <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">livraison</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
              Une méthode claire, des échanges réguliers et un suivi qui vous garde maître de votre projet.
            </p>
          </m.div>

          <div className="grid md:grid-cols-5 gap-6 relative">
            {isProcessLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-3 animate-pulse">
                    <div className="w-16 h-16 bg-muted rounded-2xl" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))
              : processSteps.map((item: ProcessStep, index: number) => (
                  <m.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center text-center relative"
                  >
                    <div className="relative mb-5">
                      <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-primary-500/30">
                        {item.step.toString().padStart(2, '0')}
                      </div>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px bg-border/60" />
                    )}
                    <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </m.div>
                ))}
          </div>
        </div>
      </section>

      {/* ─── Projects ──────────────────────────────────────────────── */}
      <section className="py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <m.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-12 bg-primary-500" />
                <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">Portfolio</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-foreground leading-[1.05]">
                Des réalisations qui parlent{' '}
                <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">d'elles-mêmes</span>
              </h2>
            </m.div>
            <m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="shrink-0">
              <Link href="/batipanorama/projets" className="group inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:gap-3 transition-all">
                Voir tous les projets
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </m.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {isProjectsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-background rounded-3xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-muted" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded" />
                    </div>
                  </div>
                ))
              : projects.map((project: Project, index: number) => (
                  <m.article key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                    <Link href={`/batipanorama/projet/${project.id}`} className="group block h-full">
                      <div className="h-full bg-background rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={project.coverImage || project.images[0] || '/images/batipanorama/project-placeholder.jpg'}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-gray-900/70 to-transparent" />
                          <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-lg">{project.category}</span>
                          <div className="absolute bottom-4 left-4">
                            <span className="flex items-center gap-1 text-white/80 text-xs">
                              <MapPinIcon className="w-3.5 h-3.5" />
                              {project.location}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">{project.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-4">{project.description}</p>
                          <div className="flex items-center justify-between pt-3 border-t border-border/40">
                            {project.surface && <span className="text-xs text-muted-foreground">{project.surface} m²</span>}
                            <span className="ml-auto flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide group-hover:gap-2 transition-all">
                              Voir le projet
                              <ArrowRightIcon className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </m.article>
                ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Band ──────────────────────────────────────────────── */}
      <section className="py-28 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgb(14_165_233/0.2)_0%,transparent_65%)] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <m.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary-400" />
                <span className="text-primary-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <SparklesIcon className="w-3.5 h-3.5" />
                  Consultation gratuite
                </span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-5">
                Vous avez un projet{' '}
                <span className="text-primary-400">en tête ?</span>
              </h2>
              <p className="text-primary-200/70 text-lg leading-relaxed mb-10">
                Expliquez-nous ce que vous imaginez. Nous vous aidons à poser les bonnes bases, avec un premier échange simple et sans engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:+261341234567" className="inline-flex items-center justify-center gap-2 px-7 py-4 font-semibold text-primary-950 bg-white rounded-xl hover:bg-primary-50 transition-all shadow-lg">
                  <PhoneIcon className="w-5 h-5" />
                  +261 34 12 34 567
                </a>
                <Link href="/batipanorama/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 font-semibold text-white bg-primary-600/40 rounded-xl hover:bg-primary-600/60 transition-all">
                  <EnvelopeIcon className="w-5 h-5" />
                  Écrire à l'équipe
                </Link>
              </div>
            </m.div>

            <m.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="space-y-4">
              {[
                { title: 'Premier échange offert', desc: 'On prend le temps de comprendre votre idée', Icon: CheckCircleIcon, color: 'text-secondary-400' },
                { title: 'Devis clair', desc: 'Une estimation détaillée, sans zone floue', Icon: CheckCircleIcon, color: 'text-primary-400' },
                { title: 'Retour rapide', desc: 'Une réponse concrète sous 24h ouvrées', Icon: CheckCircleIcon, color: 'text-primary-400' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl">
                  <item.Icon className={`w-5 h-5 mt-0.5 shrink-0 ${item.color}`} />
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-primary-300/70 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </m.div>
          </div>
        </div>
      </section>

      {/* ─── News ──────────────────────────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <m.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-12 bg-primary-500" />
                <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">Actualités</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-foreground leading-[1.05]">
                Conseils côté{' '}
                <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">construction</span>
              </h2>
            </m.div>
            <Link href="/actualites" className="group shrink-0 inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:gap-3 transition-all">
              Lire les articles
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isNewsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-3xl overflow-hidden">
                  <div className="h-48 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-20 bg-muted rounded-full" />
                    <div className="h-5 bg-muted rounded" />
                    <div className="h-4 w-4/5 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentNews.map((news: NewsItem, index: number) => (
                <m.article key={news.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                  <Link href={`/actualites/${news.slug}`} className="group block h-full">
                    <div className="h-full flex flex-col bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden shrink-0">
                        {news.coverImage
                          ? <Image src={news.coverImage} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                          : <div className="absolute inset-0 bg-muted" />}
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                        <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-lg">{categoryLabel[news.category] ?? news.category}</span>
                      </div>
                      <div className="flex flex-col flex-1 p-5">
                        <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">{news.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed flex-1">{news.excerpt}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {new Date(news.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-muted-foreground">{news.author.firstName} {news.author.lastName}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </m.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Logo Marquee ──────────────────────────────────────────── */}
      <LogoMarquee />
    </div>
  );
}

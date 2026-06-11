'use client';

import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPinIcon,
  CalendarIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  WrenchScrewdriverIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Project } from '@/features/batipanorama/types/batipanorama.types';

const PROJECT_CATEGORIES = [
  { id: 'all', label: 'Tous les projets' },
  { id: 'residentiel', label: 'Residentiel' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'industriel', label: 'Industriel' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'renovation', label: 'Renovation' }
];

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('residentiel') || cat.includes('r?sidentiel')) return <HomeModernIcon className="w-4 h-4" />;
  if (cat.includes('commercial')) return <BuildingOffice2Icon className="w-4 h-4" />;
  if (cat.includes('renovation') || cat.includes('r?novation')) return <WrenchScrewdriverIcon className="w-4 h-4" />;
  return <SparklesIcon className="w-4 h-4" />;
};

const getCategoryColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('residentiel') || cat.includes('r?sidentiel')) return 'from-green-500 to-emerald-500';
  if (cat.includes('commercial')) return 'from-primary-500 to-cyan-500';
  if (cat.includes('industriel')) return 'from-orange-500 to-red-500';
  if (cat.includes('renovation') || cat.includes('r?novation')) return 'from-purple-500 to-pink-500';
  return 'from-gray-500 to-gray-600';
};



export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['bati-projects'],
    queryFn: async () => {
      const response = await fetch('/api/bati-projects?published=true');
      const data = await response.json();
      if (data.success) {
        // Only show published and completed projects
        return data.projects.filter(
          (p: Project) => p.status === 'COMPLETED'
        );
      }
      return [];
    }
  });

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p: Project) => p.category.toLowerCase() === activeCategory.toLowerCase());


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-primary-600 to-primary-600 text-white py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
            >
              🏝️ Portfolio BatiPanorama
            </m.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Nos Réalisations</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Découvrez nos projets réalisés à Sainte-Marie / Nosy Boraha,
              témoignant de notre expertise locale et de notre engagement pour la qualité.
            </p>
          </m.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl shadow-xl p-6 mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <BuildingOffice2Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-foreground">Filtrer par catégorie</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {PROJECT_CATEGORIES.map((category, index) => (
              <m.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${activeCategory === category.id
                  ? 'bg-linear-to-r from-primary-600 to-primary-600 text-white shadow-lg'
                  : 'bg-muted text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {category.label}
              </m.button>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredProjects.length}</span> projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
          </div>
        </m.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="h-6 bg-muted rounded-full w-24"></div>
                    <div className="h-10 bg-muted rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project: Project, index: number) => (
              <m.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <ProjectCard project={project} />
              </m.div>
            ))}
          </div>
        ) : (
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl shadow-xl p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Aucun projet trouvé</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Aucun projet ne correspond à cette catégorie.
              </p>
            </div>
          </m.div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/batipanorama/projet/${project.id}`}
      className="group block"
    >
      <m.div
        whileHover={{ y: -8 }}
        className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full"
      >
        <div className="relative h-64 overflow-hidden">
          <Image
            src={project.coverImage || project.images[0] || '/images/batipanorama/project-placeholder.jpg'}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-linear-to-r ${getCategoryColor(project.category)} text-white shadow-lg`}>
              {getCategoryIcon(project.category)}
              {project.category}
            </span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">{project.title}</h3>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                {project.location}
              </span>
              {project.year && (
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {project.year}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{project.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {project.tags && project.tags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                >
                  {tag}
                </span>
              ))}
              {project.tags && project.tags.length > 2 && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
            <m.div
              className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:gap-2 transition-all"
            >
              Voir
              <ArrowRightIcon className="w-4 h-4" />
            </m.div>
          </div>
        </div>
      </m.div>
    </Link>
  );
}

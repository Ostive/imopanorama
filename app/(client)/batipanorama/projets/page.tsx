'use client';

import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/shared/theme/ThemeContext';
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


export default function ProjectsPage() {
  const { currentTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['bati-projects'],
    queryFn: async () => {
      const response = await fetch('/api/bati-projects');
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

  const categories = [
    { id: 'all', label: 'Tous les projets' },
    { id: 'résidentiel', label: 'Résidentiel' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industriel', label: 'Industriel' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'rénovation', label: 'Rénovation' }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-primary-600 to-blue-600 text-white py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
            >
              🏝️ Portfolio BatiPanorama
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Nos Réalisations</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Découvrez nos projets réalisés à Madagascar et dans l&apos;Océan Indien,
              témoignant de notre expertise et de notre engagement pour la qualité.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <BuildingOffice2Icon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Filtrer par catégorie</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${activeCategory === category.id
                  ? 'bg-linear-to-r from-primary-600 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-semibold text-primary-600">{filteredProjects.length}</span> projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project: Project, index: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun projet trouvé</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Aucun projet ne correspond à cette catégorie.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('résidentiel')) return <HomeModernIcon className="w-4 h-4" />;
    if (cat.includes('commercial')) return <BuildingOffice2Icon className="w-4 h-4" />;
    if (cat.includes('rénovation')) return <WrenchScrewdriverIcon className="w-4 h-4" />;
    return <SparklesIcon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('résidentiel')) return 'from-green-500 to-emerald-500';
    if (cat.includes('commercial')) return 'from-blue-500 to-cyan-500';
    if (cat.includes('industriel')) return 'from-orange-500 to-red-500';
    if (cat.includes('rénovation')) return 'from-purple-500 to-pink-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <Link
      href={`/batipanorama/projet/${project.id}`}
      className="group block"
    >
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full"
      >
        <div className="relative h-64 overflow-hidden">
          <Image
            src={project.coverImage || project.images[0] || '/images/placeholders/project.jpg'}
            alt={project.title}
            fill
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
          <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {project.tags && project.tags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                >
                  {tag}
                </span>
              ))}
              {project.tags && project.tags.length > 2 && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
            <motion.div
              className="flex items-center gap-1 text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all"
            >
              Voir
              <ArrowRightIcon className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

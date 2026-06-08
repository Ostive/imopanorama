'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ImageGallery } from '@/shared/components/gallery';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Squares2X2Icon as SquaresFourIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  surface?: number;
  duration?: string;
  budget?: string;
  images: string[];
  coverImage?: string;
  status: string;
  client?: string;
  year?: number;
  tags: string[];
  features: string[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.slug as string; // Keep slug param name for URL compatibility
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery'>('overview');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    if (project) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  }, [project]);

  const previousImage = useCallback(() => {
    if (project) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  }, [project]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') previousImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex, nextImage, previousImage]);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/bati-projects/${projectId}`);
      const data = await response.json();
      if (data.success) {
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Projet non trouvé</h1>
          <p className="text-muted-foreground mb-6">Le projet que vous recherchez n&apos;existe pas ou a été déplacé.</p>
          <Link 
            href="/batipanorama" 
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700`}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <Image
          src={project.coverImage || project.images[0] || '/images/batipanorama/project-placeholder.jpg'}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link 
                href="/batipanorama" 
                className="inline-flex items-center text-white bg-white/10 backdrop-blur-md hover:bg-white/20 px-5 py-2.5 rounded-xl mb-6 transition-all border border-white/20 hover:scale-105"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour aux projets
              </Link>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-primary-500 to-primary-500 text-white shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  {project.category}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                  <span className={`w-2 h-2 rounded-full ${
                    project.status === 'COMPLETED' ? 'bg-green-400' : 
                    project.status === 'IN_PROGRESS' ? 'bg-yellow-400' : 'bg-primary-400'
                  }`}></span>
                  {project.status === 'COMPLETED' ? 'Terminé' : 
                   project.status === 'IN_PROGRESS' ? 'En cours' : 'Planifié'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 md:space-x-4">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('overview')}
              className={`relative py-4 px-4 md:px-6 font-semibold text-sm md:text-base transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'text-primary-600'
                  : 'text-muted-foreground hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                activeTab === 'overview' 
                  ? 'bg-linear-to-br from-primary-500 to-primary-500 text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="hidden sm:inline">Aperçu</span>
              {activeTab === 'overview' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary-500 to-primary-500 rounded-t-full shadow-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('gallery')}
              className={`relative py-4 px-4 md:px-6 font-semibold text-sm md:text-base transition-all flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'text-primary-600'
                  : 'text-muted-foreground hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                activeTab === 'gallery' 
                  ? 'bg-linear-to-br from-primary-500 to-primary-500 text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="hidden sm:inline">Galerie</span>
              {activeTab === 'gallery' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary-500 to-primary-500 rounded-t-full shadow-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-card rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-linear-to-br from-primary-500 to-primary-500 p-2 rounded-lg">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                    Description
                  </h2>
                </div>
                <p className="text-foreground leading-relaxed">{project.description}</p>
              </div>

              {/* Caractéristiques */}
              {project.features && project.features.length > 0 && (
                <div className="bg-card rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-linear-to-br from-primary-500 to-primary-500 p-2 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                      Caractéristiques
                    </h2>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl shadow-lg p-5"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                    Informations
                  </h3>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Localisation</p>
                      <p className="text-foreground">{project.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Année</p>
                      <p className="text-foreground">{project.year}</p>
                    </div>
                  </div>
                  {project.surface && (
                    <div className="flex items-start">
                      <SquaresFourIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Surface</p>
                        <p className="text-foreground">{project.surface} m²</p>
                      </div>
                    </div>
                  )}
                  {project.client && (
                    <div className="flex items-start">
                      <div className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex items-center justify-center">
                        <span className="text-sm">👤</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Client</p>
                        <p className="text-foreground">{project.client}</p>
                      </div>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-start">
                      <div className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex items-center justify-center">
                        <span className="text-sm">💰</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Budget</p>
                        <p className="text-foreground">{project.budget}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-2xl shadow-lg p-5"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                    Tags
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-linear-to-r from-primary-100 to-primary-100 text-primary-700 border border-primary-200 hover:scale-105 transition-transform"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Gallery Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-linear-to-br from-primary-500 to-primary-500 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                  Galerie du projet
                </h2>
              </div>
              <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                {project.images.length} {project.images.length > 1 ? 'photos' : 'photo'}
              </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => openLightbox(index)}
                  className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">Photo {index + 1}</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Image Number Badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {index + 1}/{project.images.length}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Gallery Info */}
            <div className="bg-linear-to-r from-primary-50 to-primary-50 rounded-2xl p-6 border border-primary-100">
              <div className="flex items-start gap-3">
                <div className="bg-primary-500 rounded-lg p-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Galerie complète</h3>
                  <p className="text-gray-600 text-sm">
                    Cliquez sur les images pour les agrandir et découvrir tous les détails de ce projet.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Lightbox */}
      {lightboxOpen && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {project.images.length > 1 && (
            <button type="button"
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {project.images.length > 1 && (
            <button type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-7xl max-h-[90vh] w-full h-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={project.images[currentImageIndex]}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
            {currentImageIndex + 1} / {project.images.length}
          </div>

          {/* Image Info */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl text-white text-center max-w-2xl">
            <p className="font-semibold">{project.title}</p>
            <p className="text-sm text-white/80">Photo {currentImageIndex + 1}</p>
          </div>
        </motion.div>
      )}

    </div>
  );
}

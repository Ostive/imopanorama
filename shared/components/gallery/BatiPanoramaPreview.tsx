'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { GalleryImage } from './types';

interface BatiPanoramaPreviewProps {
  featuredImages: GalleryImage[];
}

export default function BatiPanoramaPreview({ featuredImages }: BatiPanoramaPreviewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-12 bg-card transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold text-primary-600 dark:text-primary-400`}>
            BatiPanorama
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez nos projets de construction et rénovation à travers notre galerie d'images professionnelles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredImages.slice(0, 3).map((image, index) => (
            <div 
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-transform duration-500 ${
                    hoveredIndex === index ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold">{image.title}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/batipanorama" 
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200`}
          >
            Voir tous nos projets
            <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

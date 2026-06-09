'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { fetchWithTimeout } from '@/shared/utils/fetchWithTimeout';

type Partner = {
  id: string;
  name: string;
  logo: string;
  website: string | null;
};

// Mock data for development/fallback - Using high-quality SVG logos
const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Caterpillar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Caterpillar_logo.svg',
    website: 'https://www.caterpillar.com'
  },
  {
    id: '2',
    name: 'Hilti',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Hilti_logo.svg',
    website: 'https://www.hilti.com'
  },
  {
    id: '3',
    name: 'Schneider Electric',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Schneider_Electric_2007.svg',
    website: 'https://www.se.com'
  },
  {
    id: '4',
    name: 'Lafarge',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/LafargeHolcim_logo.svg',
    website: 'https://www.lafargeholcim.com'
  },
  {
    id: '5',
    name: 'Saint-Gobain',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Saint-Gobain_Logo.svg',
    website: 'https://www.saint-gobain.com'
  },
  {
    id: '6',
    name: 'Bouygues',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Bouygues_logo.svg',
    website: 'https://www.bouygues-construction.com'
  },
  {
    id: '7',
    name: 'Vinci',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/VINCI_logo.svg',
    website: 'https://www.vinci.com'
  },
  {
    id: '8',
    name: 'Eiffage',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Eiffage_logo.svg',
    website: 'https://www.eiffage.com'
  }
];

export default function LogoMarquee() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetchWithTimeout('/api/partners', {}, 5000);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setPartners(data);
          }
          // If no data, keep using mock partners
        }
      } catch {
        // Silently fail (timeout or network error) — keep mock partners
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-24 bg-linear-to-br from-gray-50 via-white to-primary-50/30 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Nos Partenaires
          </m.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Ils nous font{' '}
            <span className="bg-linear-to-r from-primary-600 via-primary-600 to-primary-700 bg-clip-text text-transparent">
              confiance
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Des leaders mondiaux de la construction et de l'ingénierie nous font confiance pour leurs projets à Madagascar
          </p>
        </m.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Enhanced Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-linear-to-r from-gray-50 via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-linear-to-l from-primary-50/30 via-white/80 to-transparent z-10 pointer-events-none"></div>

          {/* Marquee with enhanced styling */}
          <div className="flex overflow-hidden py-8">
            <m.div
              className="flex gap-20 items-center"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 35,
                  ease: "linear",
                },
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <m.div
                  key={`${partner.id}-${index}`}
                  whileHover={{ scale: 1.15, y: -5 }}
                  className="shrink-0 w-65 h-37.5 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 flex items-center justify-center group cursor-pointer"
                  onClick={() => partner.website && window.open(partner.website, '_blank')}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      sizes="260px"
                      className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                  </div>
                </m.div>
              ))}
            </m.div>
          </div>
        </div>

        {/* Trust indicators */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                <span className="text-primary-600 font-bold">{partners.length}+</span> partenaires actifs
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Leaders de l'industrie
              </span>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

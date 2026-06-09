'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  HomeIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center">
          {/* Illustration */}
          <m.div
            initial={{ scale: 0.95, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="relative w-48 h-48 mx-auto mb-8"
          >
            {/* Background Circle */}
            <div className="absolute inset-0 bg-linear-to-br from-red-100 to-orange-100 rounded-full opacity-50 blur-2xl" />
            
            {/* Main Icon Container */}
            <div className="relative w-full h-full bg-linear-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              {/* Inner Circle */}
              <div className="w-36 h-36 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ExclamationTriangleIcon className="h-20 w-20 text-white" strokeWidth={2} />
              </div>
            </div>
            
            {/* Floating Particles */}
            <m.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full opacity-60"
            />
            <m.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full opacity-60"
            />
          </m.div>

          {/* Title */}
          <m.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Oups, quelque chose a coincé
          </m.h1>

          {/* Description */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            La page n&apos;a pas réussi à se charger correctement. Vous pouvez réessayer tout de suite, ou revenir à l&apos;accueil.
          </m.p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-left"
            >
              <p className="text-sm font-semibold text-red-800 mb-2">
                Détails de l&apos;erreur (visible en développement uniquement) :
              </p>
              <p className="text-sm text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  ID d&apos;erreur : {error.digest}
                </p>
              )}
            </m.div>
          )}

          {/* Action Buttons */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              <ArrowPathIcon className="h-5 w-5" />
                Réessayer maintenant
            </m.button>

            <Link href="/">
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all"
              >
                <HomeIcon className="h-5 w-5" />
                Revenir à l&apos;accueil
              </m.button>
            </Link>
          </m.div>

          {/* Help Text */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-sm text-gray-500"
          >
            Si le problème continue, vous pouvez{' '}
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-semibold">
              nous contacter
            </Link>
          </m.p>
        </div>
      </m.div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  HomeIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center">
          {/* Illustration with 404 */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="relative mb-8"
          >
            {/* Large 404 Number */}
            <h1 className="text-8xl md:text-9xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent leading-none mb-6">
              404
            </h1>
            
            {/* Home Icon Illustration */}
            <div className="relative w-40 h-40 mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-linear-to-br from-primary-100 to-primary-100 rounded-full opacity-50 blur-2xl" />
              
              {/* Main House Container */}
              <div className="relative w-full h-full">
                {/* House Base */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-20 bg-linear-to-br from-primary-500 to-primary-500 rounded-lg shadow-xl"
                >
                  {/* Door */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-white/30 rounded-t-lg" />
                  {/* Windows */}
                  <div className="absolute top-3 left-3 w-5 h-5 bg-white/40 rounded" />
                  <div className="absolute top-3 right-3 w-5 h-5 bg-white/40 rounded" />
                </motion.div>
                
                {/* House Roof */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[40px] border-l-transparent border-r-transparent border-b-primary-600 drop-shadow-lg"
                />
                
                {/* Magnifying Glass */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="absolute -right-2 top-4 w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl"
                >
                  <MagnifyingGlassIcon className="h-10 w-10 text-white" strokeWidth={2.5} />
                </motion.div>
                
                {/* Floating Question Mark */}
                <motion.div
                  animate={{ y: [-5, 5, -5], rotate: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-4 top-0 w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-xl"
                >
                  ?
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            On dirait que cette page a déménagé
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 mb-8"
          >
            Le lien n&apos;est peut-être plus à jour. Vous pouvez revenir à l&apos;accueil ou retourner à la page précédente.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                <HomeIcon className="h-5 w-5" />
                Revenir à l&apos;accueil
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Retourner en arrière
            </motion.button>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-sm text-gray-500"
          >
            Vous cherchez quelque chose de précis ?{' '}
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-semibold">
              Contactez-nous
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

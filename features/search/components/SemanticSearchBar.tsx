'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useSemanticSearch } from '../hooks/useSemanticSearch';
import PropertyCard from '@/features/properties/components/PropertyCard';

interface SemanticSearchBarProps {
  onResultsChange?: (count: number) => void;
}

export default function SemanticSearchBar({ onResultsChange }: SemanticSearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const { results, loading, error } = useSemanticSearch({
    query: debouncedQuery,
    limit: 20,
  });

  useEffect(() => {
    if (onResultsChange) {
      onResultsChange(results.length);
    }
  }, [results, onResultsChange]);

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Recherche intelligente : 'grande propriété près de la plage', 'terrain pour construire'..."
          className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <SparklesIcon className="h-5 w-5 text-primary-500" />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-primary-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <span>Recherche en cours...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && debouncedQuery && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <SparklesIcon className="h-4 w-4 text-primary-500" />
              <span>Recherche sémantique</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result: any, index: number) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  {/* Relevance Score Badge */}
                  <div className="absolute top-4 right-4 z-10 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {Math.round(result.score * 100)}% pertinent
                  </div>
                  <PropertyCard property={result.property} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {!loading && debouncedQuery && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 text-center p-12 bg-gray-50 rounded-2xl"
        >
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat</h3>
          <p className="text-gray-600">
            Essayez une autre recherche ou modifiez vos critères
          </p>
        </motion.div>
      )}

      {/* Search Tips */}
      {!debouncedQuery && (
        <div className="mt-6 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl">
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Recherche intelligente activée
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                Notre moteur de recherche comprend le sens de vos requêtes. Essayez :
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• &quot;grande propriété pour construire une maison&quot;</li>
                <li>• &quot;terrain près de la plage à Antananarivo&quot;</li>
                <li>• &quot;espace commercial en centre-ville&quot;</li>
                <li>• &quot;terrain agricole avec eau&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

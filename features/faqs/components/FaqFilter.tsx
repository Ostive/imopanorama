'use client'

import { useState, useEffect, useCallback } from 'react';
import { useFaqCategories } from '../hooks/useFaqs';
import { FaqFilter as FaqFilterType } from '@/features/faqs/types/faqs.types';

interface FaqFilterProps {
  onFilterChange: (filters: FaqFilterType) => void;
  initialFilters?: FaqFilterType;
}

export default function FaqFilter({ onFilterChange, initialFilters = {} }: FaqFilterProps) {
  const { categories, loading } = useFaqCategories();
  const [filters, setFilters] = useState<FaqFilterType>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const onFilterChangeRef = useCallback(() => onFilterChange, [onFilterChange]);

  // Appliquer les filtres lorsqu'ils changent (avec debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChangeRef()(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChangeRef]);

  // Gérer le changement de catégorie
  const handleCategoryChange = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    e.stopPropagation(); // Empêcher la propagation de l'événement
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category
    }));
  };

  // Gérer la navigation directe
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  // Gérer la soumission de la recherche
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Empêcher la propagation de l'événement
    setFilters(prev => ({
      ...prev,
      search: searchTerm.trim() || undefined
    }));
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 mb-6 transition-colors duration-200">
      <h2 className="text-lg font-semibold mb-4 text-primary-700 dark:text-primary-400">
        Filtrer les questions
      </h2>

      {/* Recherche */}
      <form onSubmit={handleSearchSubmit} className="mb-5">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            aria-label="Rechercher une question"
            className="flex-grow px-4 py-3 rounded-l-lg bg-gray-50 dark:bg-gray-700 border border-border text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-r-lg bg-primary-600 dark:bg-primary-500 text-white font-medium transition-all duration-200 hover:bg-primary-700 dark:hover:bg-primary-600 shadow-md hover:shadow-lg"
          >
            Rechercher
          </button>
        </div>
      </form>

      {/* Catégories */}
      {!loading && categories.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-3 text-foreground">
            Catégories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button type="button"
                key={category}
                onClick={(e) => handleCategoryChange(e, category)}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${filters.category === category
                    ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-foreground shadow-sm hover:shadow-md'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bouton de réinitialisation */}
      {(filters.category || filters.search) && (
        <button type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            resetFilters();
          }}
          className="text-sm font-medium focus:outline-none flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

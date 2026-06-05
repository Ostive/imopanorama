'use client'

import { useState } from 'react';
import { useFaqs } from '../hooks/useFaqs';
import { FaqFilter as FaqFilterType } from '@/features/faqs/types/faqs.types';
import FaqItem from './FaqItem';
import FaqFilter from './FaqFilter';

interface FaqListProps {
  limit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  initialCategory?: string;
}

export default function FaqList({
  limit = 10,
  showFilters = true,
  showPagination = true,
  initialCategory
}: FaqListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FaqFilterType>({
    category: initialCategory,
    isActive: true
  });

  const { faqs, loading, error, totalCount } = useFaqs({
    page: currentPage,
    limit,
    ...filters
  });

  const totalPages = Math.ceil(totalCount / limit);

  const handleFilterChange = (newFilters: FaqFilterType) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Réinitialiser à la première page lors du changement de filtres
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut de la liste
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {showFilters && (
        <FaqFilter
          onFilterChange={handleFilterChange}
        />
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </div>
                <div className="h-6 w-6 bg-muted rounded-full ml-4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
          Une erreur est survenue lors du chargement des questions fréquentes.
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-muted border border-border text-foreground px-4 py-8 rounded-xl text-center">
          Aucune question fréquente ne correspond à vos critères.
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="inline-flex space-x-2" aria-label="Pagination">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePageChange(currentPage - 1);
              }}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1
                  ? 'bg-muted text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-70'
                  : 'bg-card text-muted-foreground hover:bg-muted shadow-md'
                }`}
            >
              &laquo; Précédent
            </button>

            <div className="inline-flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePageChange(page);
                  }}
                  className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === page
                      ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg -translate-y-1 font-semibold'
                      : 'bg-card text-muted-foreground hover:bg-muted shadow-md'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePageChange(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                  ? 'bg-muted text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-70'
                  : 'bg-card text-muted-foreground hover:bg-muted shadow-md'
                }`}
            >
              Suivant &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

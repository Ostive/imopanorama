'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { FormSkeleton } from '@/shared/components/loading';
import NewsForm from '@/features/news/components/admin/NewsForm';
import {
  NewspaperIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const { data: newsData, isLoading: loading, error } = useQuery({
    queryKey: ['admin-news', id],
    enabled: !!id,
    queryFn: async () => {
      const response = await fetch(`/api/admin/news/${id}`);
      if (!response.ok) throw new Error('Article introuvable');
      return response.json();
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FormSkeleton fields={6} />
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            Erreur: {error instanceof Error ? error.message : 'Article introuvable'}
          </div>
          <Link
            href="/admin/news"
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <m.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex mb-6"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/admin"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link
                  href="/admin/news"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ml-2 transition-colors"
                >
                  Actualités
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Modifier</span>
              </div>
            </li>
          </ol>
        </m.nav>

        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <NewspaperIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Modifier l'actualité
                </h1>
                <p className="text-gray-600 mt-1">
                  Mettez à jour les informations de l'article
                </p>
              </div>
            </div>

            <Link
              href="/admin/news"
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-xl transition-all border border-gray-200 shadow-sm"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour à la liste
            </Link>
          </div>
        </m.div>

        {/* Form */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <NewsForm initialData={newsData} isEditing={true} />
        </m.div>
      </div>
    </div>
  );
}

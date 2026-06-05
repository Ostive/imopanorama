'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FormSkeleton } from '@/shared/components/loading';
import {
  NewspaperIcon,
  ArrowLeftIcon,
  PencilIcon,
  CalendarIcon,
  TagIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { sanitizeHtml } from '@/shared/utils/sanitizeHtml';

interface ViewNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewNewsPage({ params }: ViewNewsPageProps) {
  const [id, setId] = useState<string>('');
  const [newsData, setNewsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchNewsData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/news/${id}`);
        if (!response.ok) {
          throw new Error('Article introuvable');
        }
        const data = await response.json();
        setNewsData(data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
  }, [id]);

  if (isLoading) {
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            Erreur: {error || 'Article introuvable'}
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <NewspaperIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Détails de l'article
              </h1>
              <p className="text-gray-600 mt-1">
                Consultez les informations de l'article
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/news"
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-xl transition-all border border-gray-200 shadow-sm"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour
            </Link>
            <Link
              href={`/admin/news/${id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-primary-600 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Modifier
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Cover Image */}
          {newsData.coverImage && (
            <div className="relative h-96 w-full">
              <Image
                src={newsData.coverImage}
                alt={newsData.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{newsData.title}</h2>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date(newsData.publishedAt || newsData.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-semibold">
                  {newsData.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <EyeIcon className="h-4 w-4" />
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  newsData.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {newsData.isPublished ? 'Publié' : 'Brouillon'}
                </span>
              </div>
            </div>

            {/* Excerpt */}
            {newsData.excerpt && (
              <div className="mb-6 p-4 bg-primary-50 border-l-4 border-primary-500 rounded">
                <p className="text-gray-700 italic">{newsData.excerpt}</p>
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(newsData.content) }}
            />

            {/* Tags */}
            {newsData.tags && newsData.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {newsData.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Images */}
            {newsData.images && newsData.images.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Images supplémentaires:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {newsData.images.map((image: string, index: number) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

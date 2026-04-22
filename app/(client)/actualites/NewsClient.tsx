'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/shared/theme/ThemeContext';
import {
    CalendarIcon,
    ArrowRightIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import { NewsItem } from '@/features/news/types/news.types';

export default function NewsClient() {
    const { currentTheme } = useTheme();
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Catégories d'actualités
    const categories = [
        { id: 'all', label: 'Tout voir' },
        { id: 'GENERAL', label: 'Général' },
        { id: 'IMMOBILIER', label: 'Immobilier' },
        { id: 'CONSTRUCTION', label: 'Construction' },
        { id: 'EVENEMENT', label: 'Événements' },
        { id: 'ENTREPRISE', label: 'Entreprise' },
    ];

    const { data: newsItems = [], isLoading, error } = useQuery<NewsItem[]>({
        queryKey: ['news', activeCategory],
        queryFn: async () => {
            const url = activeCategory && activeCategory !== 'all'
                ? `/api/news?category=${activeCategory}`
                : '/api/news';

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Nous n'arrivons pas à charger les articles pour le moment.");
            }
            return response.json();
        }
    });

    // ... (rest of the component)



    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Fonction pour obtenir la classe de badge selon la catégorie
    const getCategoryBadgeClass = (category: string) => {
        switch (category) {
            case 'IMMOBILIER':
                return 'bg-linear-to-r from-blue-500 to-cyan-500 text-white';
            case 'CONSTRUCTION':
                return 'bg-linear-to-r from-yellow-500 to-orange-500 text-white';
            case 'EVENEMENT':
                return 'bg-linear-to-r from-purple-500 to-pink-500 text-white';
            case 'ENTREPRISE':
                return 'bg-linear-to-r from-green-500 to-emerald-500 text-white';
            default:
                return 'bg-linear-to-r from-gray-500 to-gray-600 text-white';
        }
    };

    const getCategoryEmoji = (category: string) => {
        switch (category) {
            case 'IMMOBILIER': return '🏠';
            case 'CONSTRUCTION': return '🏭';
            case 'EVENEMENT': return '📅';
            case 'ENTREPRISE': return '💼';
            default: return '📰';
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-primary-50/40 via-white to-blue-50/30">
            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-12 transition-colors duration-200"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <FunnelIcon className="w-6 h-6 text-primary-600" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Choisir un sujet</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${activeCategory === category.id
                                    ? 'bg-linear-to-r from-primary-600 to-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {category.label}
                            </motion.button>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">{newsItems.length}</span> article{newsItems.length > 1 ? 's' : ''} à lire
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden animate-pulse transition-colors duration-200">
                                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-8 space-y-4">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center transition-colors duration-200"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-5xl">⚠️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Petit souci de chargement</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{error instanceof Error ? error.message : String(error)}</p>
                        </div>
                    </motion.div>
                ) : newsItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center transition-colors duration-200"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-5xl">🔍</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Aucun article dans cette catégorie</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                                Essayez un autre sujet ou revenez bientôt, nous ajoutons régulièrement de nouveaux contenus.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                whileHover={{ y: -8 }}
                                className="h-full"
                            >
                                <Link
                                    href={`/actualites/${item.slug}`}
                                    className="group block h-full"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full">
                                        <div className="relative h-56 overflow-hidden">
                                            {item.coverImage ? (
                                                <Image
                                                    src={item.coverImage}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                                    <span className="text-gray-400 text-lg">📰</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold shadow-lg ${getCategoryBadgeClass(item.category)}`}>
                                                    {getCategoryEmoji(item.category)}
                                                    {item.category === 'GENERAL' ? 'Général' :
                                                        item.category === 'IMMOBILIER' ? 'Immobilier' :
                                                            item.category === 'CONSTRUCTION' ? 'Construction' :
                                                                item.category === 'EVENEMENT' ? 'Événement' :
                                                                    item.category === 'ENTREPRISE' ? 'Entreprise' : item.category}
                                                </span>
                                            </div>

                                            {/* Date Badge */}
                                            <div className="absolute bottom-4 left-4">
                                                <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    {formatDate(item.publishedAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.title}</h2>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{item.excerpt}</p>

                                            <div className="flex items-center justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <motion.div
                                                    className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:gap-2 transition-all"
                                                >
                                                    Lire l'article
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

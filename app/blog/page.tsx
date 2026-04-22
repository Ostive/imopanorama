'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { BlogCardSkeleton } from '@/shared/components/loading';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Catégories disponibles
  const categories = [
    { id: 'all', name: 'Tous les articles' },
    { id: 'IMMOBILIER', name: 'Immobilier' },
    { id: 'INVESTISSEMENT', name: 'Investissement' },
    { id: 'CONSTRUCTION', name: 'Construction' },
    { id: 'ACTUALITE', name: 'Actualité' }
  ];

  // Charger les articles
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Erreur lors du chargement des articles:', err);
        setError('Impossible de charger les articles. Veuillez réessayer plus tard.');
        
        // En mode développement, utiliser des données fictives
        setPosts(getMockPosts());
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtrer les articles par catégorie
  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section */}
      <div className="bg-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Actualités Immobilières</h1>
          <p className="text-xl max-w-2xl">
            Découvrez nos derniers articles, conseils et analyses sur le marché immobilier à Madagascar.
          </p>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Liste des articles */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-600">Aucun article trouvé dans cette catégorie</h3>
            <p className="mt-2 text-gray-500">Veuillez sélectionner une autre catégorie ou revenir plus tard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.coverImage || '/images/news/default-cover.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                          <Image
                            src={post.author?.avatar || '/images/placeholders/avatar.png'}
                            alt={post.author?.name || 'Auteur'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-600">{post.author?.name || 'Équipe ImoPanorama'}</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Données fictives pour le développement
function getMockPosts(): BlogPost[] {
  return [
    {
      id: '1',
      slug: 'guide-investissement-madagascar-2024',
      title: 'Guide d\'investissement immobilier à Madagascar en 2024',
      excerpt: 'Découvrez les meilleures opportunités d\'investissement immobilier à Madagascar pour cette année.',
      content: 'Contenu détaillé du guide d\'investissement...',
      coverImage: '/images/news/investment-guide.jpg',
      category: 'INVESTISSEMENT',
      publishedAt: '2024-05-15T10:30:00Z',
      author: {
        name: 'Jean Rakoto',
        avatar: '/images/news/authors/jean-rakoto.jpg'
      }
    },
    {
      id: '2',
      slug: 'marche-immobilier-antananarivo-tendances',
      title: 'Les tendances du marché immobilier à Antananarivo',
      excerpt: 'Analyse des dernières tendances du marché immobilier dans la capitale malgache.',
      content: 'Analyse détaillée des tendances du marché...',
      coverImage: '/images/news/tana-market.jpg',
      category: 'IMMOBILIER',
      publishedAt: '2024-04-22T14:15:00Z',
      author: {
        name: 'Sophie Ravalison',
        avatar: '/images/news/authors/sophie-ravalison.jpg'
      }
    },
    {
      id: '3',
      slug: 'construire-maison-ecologique-madagascar',
      title: 'Comment construire une maison écologique à Madagascar',
      excerpt: 'Guide pratique pour construire une maison respectueuse de l\'environnement à Madagascar.',
      content: 'Guide détaillé pour la construction écologique...',
      coverImage: '/images/news/eco-house.jpg',
      category: 'CONSTRUCTION',
      publishedAt: '2024-03-10T09:45:00Z',
      author: {
        name: 'Paul Randria',
        avatar: '/images/news/authors/paul-randria.jpg'
      }
    },
    {
      id: '4',
      slug: 'nouvelles-regulations-immobilieres-2024',
      title: 'Nouvelles régulations immobilières à Madagascar pour 2024',
      excerpt: 'Tout ce que vous devez savoir sur les nouvelles lois immobilières à Madagascar.',
      content: 'Détails sur les nouvelles régulations...',
      coverImage: '/images/news/regulations.jpg',
      category: 'ACTUALITE',
      publishedAt: '2024-02-28T11:20:00Z',
      author: {
        name: 'Marie Razafy',
        avatar: '/images/news/authors/marie-razafy.jpg'
      }
    },
    {
      id: '5',
      slug: 'investir-terrain-agricole-madagascar',
      title: 'Pourquoi investir dans un terrain agricole à Madagascar',
      excerpt: 'Les avantages et opportunités d\'investissement dans les terrains agricoles malgaches.',
      content: 'Analyse des opportunités d\'investissement agricole...',
      coverImage: '/images/news/agricultural-land.jpg',
      category: 'INVESTISSEMENT',
      publishedAt: '2024-01-15T16:30:00Z',
      author: {
        name: 'Jean Rakoto',
        avatar: '/images/news/authors/jean-rakoto.jpg'
      }
    },
    {
      id: '6',
      slug: 'renovation-maison-coloniale-madagascar',
      title: 'Rénover une maison coloniale à Madagascar : conseils et astuces',
      excerpt: 'Guide pour rénover et préserver le charme des maisons coloniales tout en les modernisant.',
      content: 'Guide détaillé pour la rénovation...',
      coverImage: '/images/news/colonial-house.jpg',
      category: 'CONSTRUCTION',
      publishedAt: '2023-12-05T13:45:00Z',
      author: {
        name: 'Paul Randria',
        avatar: '/images/news/authors/paul-randria.jpg'
      }
    }
  ];
}

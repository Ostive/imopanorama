'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyDetailSkeleton } from '@/shared/components/loading';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeftIcon, CalendarIcon, UserIcon, TagIcon, ShareIcon } from '@heroicons/react/24/outline';

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

type RelatedPost = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  category: string;
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('');
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // En production, nous ferions une requête API pour récupérer l'article
        // const response = await fetch(`/api/news/${slug}`);
        // if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        // const data = await response.json();
        // setPost(data);
        
        // Pour le développement, utiliser des données fictives
        const mockPost = getMockPost(slug);
        if (!mockPost) {
          throw new Error('Article non trouvé');
        }
        setPost(mockPost);

        // Récupérer des articles similaires
        setRelatedPosts(getRelatedPosts(mockPost.id, mockPost.category));
      } catch (err) {
        console.error('Erreur lors du chargement de l\'article:', err);
        setError('Impossible de charger cet article. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Article non trouvé</h2>
          <p>{error || 'Cet article n\'existe pas ou a été supprimé.'}</p>
          <Link href="/blog" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800">
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section avec image de couverture */}
      <div className="relative h-[35vh] md:h-[40vh] lg:h-[50vh]">
        <Image
          src={post.coverImage || '/images/news/default-cover.jpg'}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="container mx-auto px-4 pb-8 md:pb-12">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full mb-4 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" /> Retour aux actualités
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">{post.title}</h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Métadonnées de l'article */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-1 text-primary-600" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <TagIcon className="h-5 w-5 mr-1 text-primary-600" />
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full">{post.category}</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 mr-1 text-primary-600" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center ml-auto">
              <button className="flex items-center text-primary-600 hover:text-primary-800">
                <ShareIcon className="h-5 w-5 mr-1" />
                <span>Partager</span>
              </button>
            </div>
          </div>

          {/* Contenu de l'article */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content || '<p>Contenu de l\'article en cours de rédaction...</p>' }}
          />

          {/* Auteur */}
          <div className="mt-8 pt-5 border-t border-gray-200">
            <div className="flex items-center">
              <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                <Image
                  src={post.author?.avatar || '/images/placeholders/avatar.png'}
                  alt={post.author?.name || 'Auteur'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">À propos de l'auteur</h3>
                <p className="text-gray-600">{post.author?.name || 'Équipe ImoPanorama'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles similaires */}
        {relatedPosts.length > 0 && (
          <div className="mt-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-5">Articles similaires</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:shadow-lg group-hover:-translate-y-1">
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedPost.coverImage || '/images/news/default-cover.jpg'}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Données fictives pour le développement
function getMockPost(slug: string): BlogPost | null {
  const posts = [
    {
      id: '1',
      slug: 'guide-investissement-madagascar-2024',
      title: 'Guide d\'investissement immobilier à Madagascar en 2024',
      excerpt: 'Découvrez les meilleures opportunités d\'investissement immobilier à Madagascar pour cette année.',
      content: '<p class="lead">Madagascar offre de nombreuses opportunités d\'investissement immobilier, que ce soit pour les résidents ou les investisseurs étrangers. Ce guide vous présente les meilleures stratégies pour investir dans l\'immobilier malgache en 2024.</p><h2>Le marché immobilier à Madagascar en 2024</h2><p>Le marché immobilier malgache connaît une croissance soutenue depuis plusieurs années, particulièrement dans les grandes villes comme Antananarivo, Toamasina et Nosy Be. Les prix des terrains ont augmenté de 15% en moyenne au cours des deux dernières années.</p><h2>Les zones les plus prometteuses</h2><ul><li><strong>Antananarivo</strong> : La capitale reste le centre économique du pays avec une forte demande pour les logements de qualité.</li><li><strong>Nosy Be</strong> : Cette île touristique attire de nombreux investisseurs dans l\'immobilier de villégiature.</li><li><strong>Toamasina</strong> : Premier port du pays, cette ville connaît un développement économique important.</li><li><strong>Antsirabe</strong> : Ville thermale en plein essor pour des projets résidentiels et touristiques.</li></ul><h2>Types d\'investissements recommandés</h2><ol><li><strong>Terrains constructibles</strong> : Excellent potentiel de plus-value à moyen terme.</li><li><strong>Immobilier locatif</strong> : Rendements locatifs moyens de 8 à 12%.</li><li><strong>Projets touristiques</strong> : Perspectives intéressantes sur la côte et les îles.</li><li><strong>Immobilier commercial</strong> : Demande croissante dans les centres urbains.</li></ol><h2>Aspects juridiques</h2><p>Les étrangers ne peuvent pas posséder directement des terrains, mais peuvent obtenir des baux emphytéotiques de 18 à 99 ans. La création d\'une société de droit malgache permet d\'acquérir des biens immobiliers.</p><h2>Conclusion</h2><p>Le marché immobilier malgache offre d\'excellentes opportunités pour les investisseurs avisés. Les perspectives pour 2024 restent positives, portées par le développement économique du pays.</p>',
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

  return posts.find(post => post.slug === slug) || null;
}

function getRelatedPosts(currentPostId: string, category: string): RelatedPost[] {
  const allPosts = [
    {
      id: '1',
      slug: 'guide-investissement-madagascar-2024',
      title: 'Guide d\'investissement immobilier à Madagascar en 2024',
      coverImage: '/images/news/investment-guide.jpg',
      category: 'INVESTISSEMENT'
    },
    {
      id: '2',
      slug: 'marche-immobilier-antananarivo-tendances',
      title: 'Les tendances du marché immobilier à Antananarivo',
      coverImage: '/images/news/tana-market.jpg',
      category: 'IMMOBILIER'
    },
    {
      id: '3',
      slug: 'construire-maison-ecologique-madagascar',
      title: 'Comment construire une maison écologique à Madagascar',
      coverImage: '/images/news/eco-house.jpg',
      category: 'CONSTRUCTION'
    },
    {
      id: '4',
      slug: 'nouvelles-regulations-immobilieres-2024',
      title: 'Nouvelles régulations immobilières à Madagascar pour 2024',
      coverImage: '/images/news/regulations.jpg',
      category: 'ACTUALITE'
    },
    {
      id: '5',
      slug: 'investir-terrain-agricole-madagascar',
      title: 'Pourquoi investir dans un terrain agricole à Madagascar',
      coverImage: '/images/news/agricultural-land.jpg',
      category: 'INVESTISSEMENT'
    },
    {
      id: '6',
      slug: 'renovation-maison-coloniale-madagascar',
      title: 'Rénover une maison coloniale à Madagascar : conseils et astuces',
      coverImage: '/images/news/colonial-house.jpg',
      category: 'CONSTRUCTION'
    }
  ];

  // Filtrer les articles de la même catégorie, en excluant l'article courant
  return allPosts
    .filter(post => post.id !== currentPostId && post.category === category)
    .slice(0, 3); // Limiter à 3 articles similaires
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'; // keep useState for showShareMenu
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline';
import { NewsItem, NewsAuthor } from '@/features/news/types/news.types';
import { sanitizeHtml } from '@/shared/utils/sanitizeHtml';

// Composant Skeleton pour le blog
function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-card transition-colors duration-200">
      {/* Hero Section Skeleton */}
      <div className="relative h-[50vh]">
        <div className="absolute inset-0 bg-linear-to-t from-black to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="container mx-auto">
            <div className="h-6 w-40 bg-muted rounded animate-pulse mb-4"></div>
            <div className="h-12 w-3/4 bg-muted rounded animate-pulse mb-4"></div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-6 w-24 bg-muted rounded-full animate-pulse"></div>
              <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Article excerpt skeleton */}
          <div className="mb-8 h-24 bg-muted rounded animate-pulse"></div>

          {/* Article content skeleton */}
          <div className="space-y-4 mb-12">
            <div className="h-6 bg-muted rounded animate-pulse"></div>
            <div className="h-6 bg-muted rounded animate-pulse w-11/12"></div>
            <div className="h-6 bg-muted rounded animate-pulse w-10/12"></div>
            <div className="h-6 bg-muted rounded animate-pulse w-9/12"></div>
            <div className="h-6 bg-muted rounded animate-pulse"></div>
            <div className="h-6 bg-muted rounded animate-pulse w-10/12"></div>
            <div className="h-6 bg-muted rounded animate-pulse w-8/12"></div>
          </div>

          {/* Tags skeleton */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="h-6 w-20 bg-muted rounded animate-pulse mb-4"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-16 bg-muted rounded-full animate-pulse"></div>
              <div className="h-8 w-24 bg-muted rounded-full animate-pulse"></div>
              <div className="h-8 w-20 bg-muted rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Image Gallery skeleton */}
          <div className="mt-12">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden bg-muted animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [showShareMenu, setShowShareMenu] = useState(false);

  const { data: newsItem = null, isLoading, error } = useQuery<NewsItem>({
    // ... query stays same ...
    queryKey: ['news', slug],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/news/${slug}`);
        if (!response.ok) {
          throw new Error('Actualité non trouvée');
        }
        return await response.json();
      } catch (err) {
        console.error('Error fetching news detail:', err);
        // Fallback mock data
        return {
          id: '1',
          title: 'Nouveau projet immobilier à Antananarivo',
          slug: slug as string,
          content: `
            <p>Nous sommes ravis de vous annoncer le lancement de notre nouveau projet immobilier dans le quartier d'Ankadimbahoaka à Antananarivo.</p>
            <p>Ce projet comprendra :</p>
            <ul>
              <li>50 appartements de standing</li>
              <li>Une piscine commune</li>
              <li>Un espace de coworking</li>
              <li>Un jardin paysager</li>
              <li>Un parking souterrain</li>
            </ul>
            <p>Les travaux débuteront en janvier 2026 pour une livraison prévue au premier trimestre 2027.</p>
            <p>N'hésitez pas à nous contacter pour plus d'informations ou pour réserver votre appartement dès maintenant.</p>
          `,
          excerpt: 'Découvrez notre nouveau projet immobilier dans le quartier d\'Ankadimbahoaka à Antananarivo.',
          coverImage: '/images/social/og-image.png',
          images: [
            '/images/social/og-image.png',
            '/images/social/og-image.png',
            '/images/social/og-image.png',
          ],
          category: 'IMMOBILIER',
          tags: ['immobilier', 'projet', 'antananarivo'],
          publishedAt: new Date().toISOString(),
          author: {
            id: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
          },
        };
      }
    },
    enabled: !!slug
  });

  // Fonction pour partager l'article
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = newsItem?.title || '';

    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papier !');
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  // Fonction pour calculer le temps de lecture
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de lecture`;
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Fonction pour obtenir le libellé de la catégorie
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'GENERAL': return 'Général';
      case 'IMMOBILIER': return 'Immobilier';
      case 'CONSTRUCTION': return 'Construction';
      case 'EVENEMENT': return 'Événement';
      case 'ENTREPRISE': return 'Entreprise';
      default: return category;
    }
  };

  // Fonction pour obtenir la classe de badge selon la catégorie
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'IMMOBILIER':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200';
      case 'CONSTRUCTION':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'EVENEMENT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'ENTREPRISE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };


  if (isLoading) {
    return <BlogSkeleton />;
  }

  if (error && !newsItem) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Article introuvable</h2>
          <p className="text-muted-foreground mb-8">Cet article n&apos;existe pas ou a été retiré. Revenez à la liste des actualités pour découvrir nos autres contenus.</p>
          <button type="button"
            onClick={() => router.push('/actualites')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Retour aux actualités
          </button>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-card transition-colors duration-200">
      {/* Hero Section with Cover Image */}
      <div className="relative h-[50vh]">
        <div className="absolute inset-0 bg-linear-to-t from-black to-transparent z-10"></div>
        {newsItem.coverImage ? (
          <Image
            src={newsItem.coverImage}
            alt={newsItem.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600"></div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="container mx-auto">
            <Link
              href="/actualites"
              className="inline-flex items-center text-white hover:text-gray-200 mb-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour aux actualités
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{newsItem.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadgeClass(newsItem.category)}`}>
                {getCategoryLabel(newsItem.category)}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {formatDate(newsItem.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {calculateReadTime(newsItem.content || '')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-card transition-colors duration-200">
        <div className="container mx-auto px-4 py-4 border-b border-border">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                  Accueil
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/actualites" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                    Actualités
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-muted-foreground">{newsItem.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Article excerpt */}
          {newsItem.excerpt && (
            <div className="mb-8 text-xl text-muted-foreground font-light italic border-l-4 border-indigo-500 pl-4">
              {newsItem.excerpt}
            </div>
          )}

          {/* Article content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(newsItem.content) }}
          />

          {/* Share Section */}
          <div className="mb-8 pb-8 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Partager cet article</h3>
              <div className="relative">
                <button type="button"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-input hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Partager
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu">
                      <button type="button"
                        onClick={() => handleShare('facebook')}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <svg className="h-5 w-5 mr-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </button>
                      <button type="button"
                        onClick={() => handleShare('twitter')}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <svg className="h-5 w-5 mr-3 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        Twitter
                      </button>
                      <button type="button"
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <svg className="h-5 w-5 mr-3 text-primary-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </button>
                      <button type="button"
                        onClick={() => handleShare('whatsapp')}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <svg className="h-5 w-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </button>
                      <button type="button"
                        onClick={() => handleShare('copy')}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copier le lien
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {newsItem.tags && newsItem.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-medium text-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {newsItem.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-700 text-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Image Gallery */}
          {newsItem.images && newsItem.images.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-foreground mb-6">Galerie d&apos;images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newsItem.images.map((image, index) => (
                  <div key={image} className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`Image ${index + 1} pour ${newsItem.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

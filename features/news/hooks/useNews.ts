import { useQuery } from '@tanstack/react-query';

interface NewsSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  isPublished?: boolean;
  search?: string;
}

interface NewsResponse {
  data: any[];
  total: number;
  page: number;
}

export function useNews(params: NewsSearchParams = {}) {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['news', params],
    queryFn: async (): Promise<NewsResponse> => {
      try {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());
        if (params.category) queryParams.set('category', params.category);
        if (params.isPublished !== undefined) queryParams.set('isPublished', params.isPublished.toString());
        if (params.search) queryParams.set('search', params.search);
        
        const url = `/api/admin/news?${queryParams.toString()}`;

        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Gestion détaillée des erreurs HTTP
        if (!response.ok) {
          let errorMessage = 'Une erreur est survenue';
          
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
          }
          
          // Messages d'erreur spécifiques selon le code HTTP
          switch (response.status) {
            case 400:
              throw new Error(`Données invalides: ${errorMessage}`);
            case 401:
              throw new Error('Vous devez être connecté pour accéder aux actualités');
            case 403:
              throw new Error('Vous n\'avez pas les permissions nécessaires pour accéder aux actualités');
            case 404:
              throw new Error('L\'API des actualités n\'a pas été trouvée');
            case 500:
              throw new Error('Erreur serveur. Veuillez réessayer plus tard');
            case 503:
              throw new Error('Service temporairement indisponible. Veuillez réessayer');
            default:
              throw new Error(errorMessage);
          }
        }
        
        let responseData;
        try {
          responseData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse response JSON:', parseError);
          throw new Error('Réponse invalide du serveur');
        }
        
        // Validation de la structure de la réponse
        const newsArray = responseData.data || responseData || [];
        
        if (!Array.isArray(newsArray)) {
          throw new Error('Format de données invalide reçu du serveur');
        }
        
        return {
          data: newsArray,
          total: responseData.total || newsArray.length,
          page: responseData.page || params.page || 1
        };
      } catch (err) {
        // Gestion des erreurs réseau
        if (err instanceof TypeError && err.message.includes('fetch')) {
          console.error('Network error:', err);
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet');
        }
        
        // Re-throw l'erreur pour que React Query la gère
        console.error('Error fetching news:', err);
        throw err;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      // Ne pas réessayer pour les erreurs d'authentification ou de permission
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          return false;
        }
      }
      // Réessayer max 2 fois pour les autres erreurs
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponentiel
  });

  return {
    news: data?.data || [],
    loading: isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
    total: data?.total || 0,
    page: data?.page || 1,
    refetch,
  };
}

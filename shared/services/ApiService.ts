import { config } from '@/shared/config';
import { APIResponse, PaginatedResponse } from '@/shared/types';

interface RequestOptions<T = unknown> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: T;
  timeout?: number;
}

export abstract class ApiService {
  protected baseUrl: string;
  protected timeout: number;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  protected async request<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Essayer d'extraire le message d'erreur du corps de la réponse
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            throw new Error(errorData.error);
          }
        } catch (jsonError) {
          // Si on ne peut pas extraire le message d'erreur, utiliser un message convivial selon le code
        }
        
        // Messages d'erreur personnalisés selon le code HTTP
        if (response.status === 401) {
          throw new Error('Identifiants incorrects ou session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 403) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.');
        } else if (response.status === 404) {
          throw new Error('La ressource demandée n\'existe pas ou a été déplacée.');
        } else if (response.status === 500) {
          throw new Error('Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.');
        } else {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Network error');
    }
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request<T>(url, { method: 'GET' });
  }

  protected async post<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data
    });
  }

  protected async put<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data
    });
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  protected async patch<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data
    });
  }
}

// Service de base avec retry et cache (pour les futurs microservices)
export abstract class MicroserviceClient extends ApiService {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private cacheTimeout: number;

  constructor(baseUrl: string, cacheTimeout = 300000) { // 5 minutes par défaut
    super(baseUrl);
    this.cacheTimeout = cacheTimeout;
  }

  protected async getWithCache<T>(
    endpoint: string, 
    params?: Record<string, unknown>,
    cacheKey?: string
  ): Promise<T> {
    const key = cacheKey || `${endpoint}:${JSON.stringify(params)}`;
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }

    const data = await this.get<T>(endpoint, params);
    this.cache.set(key, { data, timestamp: Date.now() });
    
    return data;
  }

  protected clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    Array.from(this.cache.keys()).forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  protected async retryRequest<T>(
    request: () => Promise<T>,
    retries = config.api.retries
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= retries; i++) {
      try {
        return await request();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (i < retries) {
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, i) * 1000)
          );
        }
      }
    }
    
    throw lastError!;
  }
}

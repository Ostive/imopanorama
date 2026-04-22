// Types partagés entre les modules
export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interest: 'terrain' | 'construction' | 'both' | 'other';
  message: string;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Utilitaires
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

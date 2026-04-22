'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Faq, FaqFormData, FaqSearchParams } from '@/features/faqs/types/faqs.types';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchWithTimeout } from '@/shared/utils/fetchWithTimeout';

export function useFaqs(params?: FaqSearchParams) {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { data, isLoading: loading, error, refetch } = useQuery<{ faqs: Faq[], totalCount: number }>({
    queryKey: ['faqs', params],
    enabled: params?.enabled !== false,
    staleTime: 5 * 60_000,  // 5 min — les FAQs changent rarement
    retry: 1,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.category) queryParams.append('category', params.category);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        if (params.search) queryParams.append('search', params.search);
      }
      const response = await fetchWithTimeout(`/api/faqs?${queryParams.toString()}`, {}, 5000);
      if (!response.ok) throw new Error('Erreur lors de la récupération des FAQs');
      return await response.json();
    }
  });

  const faqs = data?.faqs || [];
  const totalCount = data?.totalCount || 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (faqData: FaqFormData) => {
      if (!token) throw new Error('Vous devez être connecté pour créer une FAQ');
      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(faqData),
      });
      if (!response.ok) throw new Error('Erreur lors de la création de la FAQ');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FaqFormData> }) => {
      if (!token) throw new Error('Vous devez être connecté pour modifier une FAQ');
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour de la FAQ');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Vous devez être connecté pour supprimer une FAQ');
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de la FAQ');
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    }
  });

  // Wrappers to maintain compatibility (returning Promise<Result | null>)
  const createFaq = async (faqData: FaqFormData): Promise<Faq | null> => {
    try { return await createMutation.mutateAsync(faqData); } catch (e) { console.error('Erreur lors de la création de la FAQ:', e); return null; }
  }
  const updateFaq = async (id: string, faqData: Partial<FaqFormData>): Promise<Faq | null> => {
    try { return await updateMutation.mutateAsync({ id, data: faqData }); } catch (e) { console.error('Erreur lors de la mise à jour de la FAQ:', e); return null; }
  }
  const deleteFaq = async (id: string): Promise<boolean> => {
    try { return await deleteMutation.mutateAsync(id); } catch (e) { console.error('Erreur lors de la suppression de la FAQ:', e); return false; }
  }

  return {
    faqs,
    loading,
    error: error ? (error as Error).message : null,
    totalCount,
    fetchFaqs: () => refetch(),
    createFaq,
    updateFaq,
    deleteFaq
  };
}

export function useFaqCategories() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['faqCategories'],
    queryFn: async () => {
      const response = await fetch('/api/faqs/categories');
      if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
      const d = await response.json();
      return d.categories;
    }
  });
  return { categories: (data as string[]) || [], loading, error: error ? (error as Error).message : null };
}

export function useFaq(id: string) {
  const { data: faq = null, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['faq', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`/api/faqs/${id}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de la FAQ');
      return await response.json();
    },
    enabled: !!id
  });

  return { faq, loading, error: error ? (error as Error).message : null, fetchFaq: () => refetch() };
}

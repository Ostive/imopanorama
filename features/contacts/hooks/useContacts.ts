'use client'

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Contact, ContactFormData, ContactSearchParams, ContactStats } from '@/features/contacts/types/contacts.types';

interface UseContactsResult {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => void;
}

export function useContacts(params: ContactSearchParams = {}): UseContactsResult {
  const { data, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['contacts', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.sort) searchParams.set('sort', params.sort);

      if (params.filter?.isRead !== undefined) {
        searchParams.set('isRead', params.filter.isRead.toString());
      }
      if (params.filter?.propertyId) {
        searchParams.set('propertyId', params.filter.propertyId);
      }
      if (params.filter?.search) {
        searchParams.set('search', params.filter.search);
      }

      const response = await fetch(`/api/contacts?${searchParams.toString()}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des contacts');
      }

      return await response.json();
    }
  });

  return {
    contacts: data?.contacts || [],
    loading,
    error: error ? (error as Error).message : null,
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 0,
    refetch,
  };
}

interface UseContactStatsResult {
  stats: ContactStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContactStats(): UseContactStatsResult {
  const { data: stats = null, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['contactStats'],
    queryFn: async () => {
      const response = await fetch('/api/contacts/stats', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
      return await response.json();
    }
  });

  return {
    stats,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

export async function markContactAsRead(id: string): Promise<void> {
  const response = await fetch(`/api/contacts/${id}/read`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour du contact');
}

export async function markContactAsUnread(id: string): Promise<void> {
  const response = await fetch(`/api/contacts/${id}/read`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour du contact');
}

export async function deleteContact(id: string): Promise<void> {
  const response = await fetch(`/api/contacts/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression du contact');
}

export async function createContact(data: ContactFormData): Promise<Contact> {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
  }

  return response.json();
}

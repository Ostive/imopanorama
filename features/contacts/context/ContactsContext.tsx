'use client';

import React, { createContext, use, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchWithTimeout } from '@/shared/utils/fetchWithTimeout';

interface ContactsContextType {
  contactsCount: number;
  refreshContactsCount: () => Promise<void>;
  incrementContactsCount: () => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);
const CONTACTS_COUNT_KEY = ['contacts-count'];

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contactsCount = 0, refetch } = useQuery<number>({
    queryKey: [...CONTACTS_COUNT_KEY, user?.id],
    queryFn: async () => {
      const response = await fetchWithTimeout('/api/contacts/count', {}, 5000);
      if (!response.ok) return 0;
      const data = await response.json();
      return data.count || 0;
    },
    enabled: isAuthenticated,
    initialData: 0,
    retry: 1,
  });

  const refreshContactsCount = useCallback(async () => {
    if (!isAuthenticated) {
      queryClient.setQueryData([...CONTACTS_COUNT_KEY, user?.id], 0);
      return;
    }
    await refetch();
  }, [isAuthenticated, queryClient, refetch, user?.id]);

  const incrementContactsCount = useCallback(() => {
    queryClient.setQueryData<number>([...CONTACTS_COUNT_KEY, user?.id], (previous = 0) => previous + 1);
  }, [queryClient, user?.id]);

  const value = useMemo(() => ({
    contactsCount,
    refreshContactsCount,
    incrementContactsCount,
  }), [contactsCount, refreshContactsCount, incrementContactsCount]);

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = use(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchWithTimeout } from '@/shared/utils/fetchWithTimeout';

interface ContactsContextType {
  contactsCount: number;
  refreshContactsCount: () => Promise<void>;
  incrementContactsCount: () => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contactsCount, setContactsCount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  const refreshContactsCount = useCallback(async () => {
    if (!isAuthenticated) {
      setContactsCount(0);
      return;
    }

    try {
      const response = await fetchWithTimeout('/api/contacts/count', {}, 5000);
      if (response.ok) {
        const data = await response.json();
        setContactsCount(data.count || 0);
      }
    } catch {
      // Silently fail (timeout or network error)
    }
  }, [isAuthenticated]);

  const incrementContactsCount = useCallback(() => {
    setContactsCount((prev) => prev + 1);
  }, []);

  // Fetch contacts count on mount and when auth state changes
  useEffect(() => {
    refreshContactsCount();
  }, [refreshContactsCount, isAuthenticated, user]);

  const value = {
    contactsCount,
    refreshContactsCount,
    incrementContactsCount,
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}

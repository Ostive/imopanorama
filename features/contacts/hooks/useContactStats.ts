import { useState, useEffect } from 'react';
import { ContactStats } from '../types';

export function useContactStats() {
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/contacts/stats');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des statistiques:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}

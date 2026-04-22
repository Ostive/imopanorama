import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

interface UserSearchParams {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}

export function useUsers(params: UserSearchParams = {}) {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const result = await userService.getAllUsers(params);
      return result;
    },
    staleTime: 30 * 1000, // 30 seconds
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      // Ne pas réessayer pour les erreurs d'authentification
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          return false;
        }
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    users: data?.data || [],
    loading: isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
    total: data?.total || 0,
    page: data?.page || 1,
    refetch,
  };
}

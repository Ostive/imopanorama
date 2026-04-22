import { User } from '@/features/auth/types';
import { logger } from '@/infrastructure/logger/logger';

interface UserSearchParams {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  isActive?: boolean;
}

class UserService {
  /**
   * Récupère tous les utilisateurs avec pagination et filtres (admin uniquement)
   */
  async getAllUsers(params: UserSearchParams = {}): Promise<{ data: User[]; total: number; page: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.role) queryParams.set('role', params.role);
      if (params.isActive !== undefined) queryParams.set('isActive', params.isActive.toString());
      if (params.search) queryParams.set('search', params.search);
      
      const url = `/api/admin/users?${queryParams.toString()}`;
      logger.debug('Fetching users', { url });
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // Important: inclure les cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }

      const responseData = await response.json();
      
      // Si la réponse est un tableau simple (sans pagination)
      if (Array.isArray(responseData)) {
        return {
          data: responseData,
          total: responseData.length,
          page: params.page || 1
        };
      }
      
      // Si la réponse contient pagination
      return {
        data: responseData.data || responseData.users || [],
        total: responseData.total || 0,
        page: responseData.page || params.page || 1
      };
    } catch (error) {
      logger.error('Error fetching users', error);
      throw error;
    }
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(userId: string, data: UserUpdateData): Promise<User> {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...data }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      logger.error('Error updating user', error);
      throw error;
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      logger.error('Error deleting user', error);
      throw error;
    }
  }
}

export const userService = new UserService();

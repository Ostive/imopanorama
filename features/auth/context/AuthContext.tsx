'use client'

import React, { createContext, use, useReducer, useEffect } from 'react';
import { useSession, signIn, signUp, signOut, authClient } from '@/infrastructure/auth/auth-client';
import {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData
} from '@/features/auth/types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: User }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
}

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  // Use Better Auth session
  const { data: session, isPending } = useSession();

  // Sync Better Auth session with our state
  useEffect(() => {
    if (isPending) {
      dispatch({ type: 'SET_LOADING', payload: true });
      return;
    }

    if (session?.user) {
      const betterAuthUser = session.user;

      const user: User = {
        id: betterAuthUser.id,
        email: betterAuthUser.email || '',
        firstName: betterAuthUser.firstName || betterAuthUser.name?.split(' ')[0] || '',
        lastName: betterAuthUser.lastName || betterAuthUser.name?.split(' ').slice(1).join(' ') || '',
        role: ((betterAuthUser.role as string)?.toLowerCase() || 'client') as User['role'],
        phone: (betterAuthUser.phone as string) || undefined,
        company: (betterAuthUser.company as string) || undefined,
        isActive: true,
        createdAt: betterAuthUser.createdAt ? new Date(betterAuthUser.createdAt as unknown as string) : new Date(),
        updatedAt: betterAuthUser.updatedAt ? new Date(betterAuthUser.updatedAt as unknown as string) : new Date(),
      };

      dispatch({
        type: 'SET_USER',
        payload: { user, token: 'better-auth-session' }
      });
    } else {
      // Only dispatch logout if we were previously authenticated or loading
      if (state.isAuthenticated || state.loading) {
        dispatch({ type: 'LOGOUT' });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  }, [session, isPending, state.isAuthenticated, state.loading]);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const { email, password } = credentials;

      const { data, error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Erreur de connexion');
      }

      // Success is handled by the useEffect syncing the session
      // But we can verify explicitly if needed
    } catch (error) {
      let errorMessage = 'Erreur de connexion';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'REGISTER_START' });

      if (data.password !== data.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      const { error } = await signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        company: data.company,
      } as any);

      if (error) {
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }

      // Success is handled by the useEffect syncing the session
    } catch (error) {
      dispatch({
        type: 'REGISTER_ERROR',
        payload: error instanceof Error ? error.message : 'Erreur lors de l\'inscription'
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      dispatch({ type: 'LOGOUT' });
      // Redirect to home or login is often handled by components or middleware
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // BetterAuth: request password reset email
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/reset-password',
      });

      if (error) throw new Error(error.message);

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (data.newPassword !== data.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      const { error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      });

      if (error) throw new Error(error.message);

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Update basic fields
      const { data: updatedData, error } = await authClient.updateUser({
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.company !== undefined && { company: data.company }),
      } as any);

      if (error) throw new Error(error.message);

      // We might need to handle specific metadata updates if updateUser doesn't cover all custom fields by default
      // depending on client version.

      // Check if session needs reload
      // useSession should pick up changes or we can force reload logic if needed

      const currentUser = state.user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedUser });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!state.user) return false;

    if (Array.isArray(role)) {
      return role.some(r => state.user!.role.toUpperCase() === r.toUpperCase());
    }

    return state.user.role.toUpperCase() === role.toUpperCase();
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;

    if (state.user.role.toUpperCase() === 'ADMIN' || state.user.role.toUpperCase() === 'SUPER_ADMIN') {
      return true;
    }

    // Role-based permissions mapping (previously in authService)
    const rolePermissions: Record<string, string[]> = {
      agent: [
        'property:read',
        'property:create',
        'property:update',
        'user:read',
        'contact:read',
        'contact:update'
      ],
      client: [
        'property:read',
        'contact:create',
        'favorite:read',
        'favorite:create',
        'favorite:delete'
      ]
    };

    const userRole = state.user.role.toLowerCase();
    return rolePermissions[userRole]?.includes(permission) || false;
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    changePassword,
    updateProfile,
    hasRole,
    hasPermission,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé
export function useAuth() {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

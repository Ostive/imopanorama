export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'agent' | 'super_admin' | 'client';
    avatar?: string;
    phone?: string;
    company?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
    company?: string;
    acceptTerms: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: string;
}

export interface ResetPasswordData {
    email: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    avatar?: string;
}

export interface Permission {
    id: string;
    name: string;
    resource: string;
    action: 'create' | 'read' | 'update' | 'delete';
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

const USER_ROLES = {
    ADMIN: 'admin',
    AGENT: 'agent',
    SUPER_ADMIN: 'super_admin',
    CLIENT: 'client'
} as const;

const PERMISSIONS = {
    TERRAIN_CREATE: 'terrain:create',
    TERRAIN_READ: 'terrain:read',
    TERRAIN_UPDATE: 'terrain:update',
    TERRAIN_DELETE: 'terrain:delete',
    USER_CREATE: 'user:create',
    USER_READ: 'user:read',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
    ADMIN_DASHBOARD: 'admin:dashboard',
    ADMIN_SETTINGS: 'admin:settings',
    BATI_MANAGE: 'bati:manage'
} as const;

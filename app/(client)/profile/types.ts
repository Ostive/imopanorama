// Types pour la page profil
export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  role?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

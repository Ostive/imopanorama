import { z } from 'zod';

// Schéma pour la validation du formulaire de connexion
export const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  rememberMe: z.boolean().optional(),
});

// Schéma pour la validation du formulaire d'inscription
export const registerSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Adresse email invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  confirmPassword: z.string().min(6, { message: 'La confirmation du mot de passe doit contenir au moins 6 caractères' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, { message: 'Vous devez accepter les conditions d\'utilisation' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Schéma pour la mise à jour du profil
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  phone: z.string().optional(),
  company: z.string().optional(),
});

// Schéma pour le changement de mot de passe
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Le mot de passe actuel doit contenir au moins 6 caractères' }),
  newPassword: z.string().min(6, { message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' }),
  confirmPassword: z.string().min(6, { message: 'La confirmation du mot de passe doit contenir au moins 6 caractères' }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Types inférés à partir des schémas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

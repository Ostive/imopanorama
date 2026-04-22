import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  profileUpdateSchema,
  passwordChangeSchema,
} from '@/features/auth/schemas/auth.schema';

describe('loginSchema', () => {
  it('should validate a valid login payload', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should accept rememberMe as optional boolean', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secure123',
      rememberMe: true,
    });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Adresse email invalide');
  });

  it('should reject a password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      'Le mot de passe doit contenir au moins 6 caractères'
    );
  });

  it('should reject missing email', () => {
    const result = loginSchema.safeParse({ password: 'password123' });
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validPayload = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@example.com',
    password: 'securePass1',
    confirmPassword: 'securePass1',
    acceptTerms: true,
  };

  it('should validate a valid registration payload', () => {
    const result = registerSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should accept optional phone and company fields', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      phone: '+261341234567',
      company: 'Acme Corp',
    });
    expect(result.success).toBe(true);
  });

  it('should reject firstName shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validPayload, firstName: 'J' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('prénom');
  });

  it('should reject lastName shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validPayload, lastName: 'D' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('nom');
  });

  it('should reject an invalid email', () => {
    const result = registerSchema.safeParse({ ...validPayload, email: 'invalid' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Adresse email invalide');
  });

  it('should reject mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password: 'password1',
      confirmPassword: 'password2',
    });
    expect(result.success).toBe(false);
    const mismatchError = result.error?.issues.find(
      (i) => i.message === 'Les mots de passe ne correspondent pas'
    );
    expect(mismatchError).toBeDefined();
  });

  it('should reject when acceptTerms is false', () => {
    const result = registerSchema.safeParse({ ...validPayload, acceptTerms: false });
    expect(result.success).toBe(false);
    const termsError = result.error?.issues.find(
      (i) => i.message === "Vous devez accepter les conditions d'utilisation"
    );
    expect(termsError).toBeDefined();
  });

  it('should reject missing acceptTerms', () => {
    const { acceptTerms: _, ...withoutTerms } = validPayload;
    const result = registerSchema.safeParse(withoutTerms);
    expect(result.success).toBe(false);
  });
});

describe('profileUpdateSchema', () => {
  it('should validate a valid profile update', () => {
    const result = profileUpdateSchema.safeParse({
      firstName: 'Jean',
      lastName: 'Dupont',
    });
    expect(result.success).toBe(true);
  });

  it('should accept optional phone and company', () => {
    const result = profileUpdateSchema.safeParse({
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '+261341234567',
      company: 'Acme',
    });
    expect(result.success).toBe(true);
  });

  it('should reject firstName shorter than 2 characters', () => {
    const result = profileUpdateSchema.safeParse({
      firstName: 'J',
      lastName: 'Dupont',
    });
    expect(result.success).toBe(false);
  });

  it('should reject lastName shorter than 2 characters', () => {
    const result = profileUpdateSchema.safeParse({
      firstName: 'Jean',
      lastName: 'D',
    });
    expect(result.success).toBe(false);
  });
});

describe('passwordChangeSchema', () => {
  const validPayload = {
    currentPassword: 'oldPass1',
    newPassword: 'newPass1',
    confirmPassword: 'newPass1',
  };

  it('should validate a valid password change', () => {
    const result = passwordChangeSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should reject currentPassword shorter than 6 characters', () => {
    const result = passwordChangeSchema.safeParse({
      ...validPayload,
      currentPassword: '123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject newPassword shorter than 6 characters', () => {
    const result = passwordChangeSchema.safeParse({
      ...validPayload,
      newPassword: '123',
      confirmPassword: '123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject mismatched new passwords', () => {
    const result = passwordChangeSchema.safeParse({
      ...validPayload,
      newPassword: 'newPass1',
      confirmPassword: 'differentPass',
    });
    expect(result.success).toBe(false);
    const mismatchError = result.error?.issues.find(
      (i) => i.message === 'Les mots de passe ne correspondent pas'
    );
    expect(mismatchError).toBeDefined();
  });

  it('should reject missing fields', () => {
    const result = passwordChangeSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThan(0);
  });
});

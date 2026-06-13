'use client';

import { useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/infrastructure/auth/auth-client';
import { m } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  PhoneIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

type RegisterState = {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  error: string;
};

type RegisterAction =
  | { type: 'field'; name: keyof RegisterState['formData']; value: string }
  | { type: 'toggle-password' }
  | { type: 'toggle-confirm-password' }
  | { type: 'loading'; value: boolean }
  | { type: 'error'; value: string };

const registerInitialState: RegisterState = {
  formData: {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  },
  showPassword: false,
  showConfirmPassword: false,
  isLoading: false,
  error: '',
};

function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case 'field':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.name]: action.value,
        },
      };
    case 'toggle-password':
      return { ...state, showPassword: !state.showPassword };
    case 'toggle-confirm-password':
      return { ...state, showConfirmPassword: !state.showConfirmPassword };
    case 'loading':
      return { ...state, isLoading: action.value };
    case 'error':
      return { ...state, error: action.value };
  }
}

export default function RegisterNewPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(registerReducer, registerInitialState);
  const { formData, showPassword, showConfirmPassword, isLoading, error } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'field',
      name: e.target.name as keyof RegisterState['formData'],
      value: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'loading', value: true });
    dispatch({ type: 'error', value: '' });

    // Validation
    if (formData.password !== formData.confirmPassword) {
      dispatch({ type: 'error', value: 'Les mots de passe ne correspondent pas' });
      dispatch({ type: 'loading', value: false });
      return;
    }

    if (formData.password.length < 8) {
      dispatch({ type: 'error', value: 'Le mot de passe doit contenir au moins 8 caractères' });
      dispatch({ type: 'loading', value: false });
      return;
    }

    try {
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      } as any);

      if (result.error) {
        dispatch({ type: 'error', value: result.error.message || 'Erreur lors de l\'inscription' });
        dispatch({ type: 'loading', value: false });
        return;
      }

      // Registration successful, redirect to home
      router.push('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      dispatch({ type: 'error', value: err.message || 'Une erreur est survenue lors de l\'inscription' });
    } finally {
      dispatch({ type: 'loading', value: false });
    }
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-primary-50 via-white to-accent-50 relative">
      {/* Animated background elements for entire page - like home */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-6000"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden z-10">
        {/* Beautiful gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary-600 via-primary-700 to-primary-600"></div>
        {/* Animated overlay pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-300/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link href="/">
              <Image
                src="/images/brand/logo.png"
                alt="ImoPanorama"
                width={200}
                height={60}
                className="h-14 w-auto object-contain brightness-0 invert mx-auto mb-6"
                priority
              />
            </Link>
            {/* Logo Image */}
            <div className="relative w-80 h-80 mb-8 mx-auto">
              <Image
                src="/images/auth/auth-illustration.png"
                alt="ImoPanorama Logo"
                fill
                sizes="320px"
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <p className="text-xl text-white/95 mb-10 max-w-md leading-relaxed">
              Votre partenaire immobilier de confiance à Madagascar
            </p>
            <div className="flex items-center justify-center gap-12 text-white">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/80 uppercase tracking-wider">Propriétés</div>
              </div>
              <div className="w-px h-16 bg-linear-to-b from-transparent via-white/40 to-transparent"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">1000+</div>
                <div className="text-sm text-white/80 uppercase tracking-wider">Clients</div>
              </div>
              <div className="w-px h-16 bg-linear-to-b from-transparent via-white/40 to-transparent"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">10+</div>
                <div className="text-sm text-white/80 uppercase tracking-wider">Années</div>
              </div>
            </div>
          </m.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10">
        {/* Back button — desktop only (absolute) */}
        <Link
          href="/"
          className="hidden lg:flex absolute top-8 left-8 p-3 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 border-2 border-border hover:border-primary-500 rounded-xl shadow-lg hover:shadow-xl transition-all group"
        >
          <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

        <m.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="p-4">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-6">
              <Link href="/">
                <Image
                  src="/images/brand/logo.png"
                  alt="ImoPanorama Madagascar"
                  width={320}
                  height={100}
                  className="h-28 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Header */}
            <div className="mb-4 text-center">
              <p className="text-sm text-foreground">Rejoignez ImoPanorama dès aujourd'hui</p>
            </div>

            {/* Error Message */}
            {error && (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm"
              >
                {error}
              </m.div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-first-name" className="block text-xs font-semibold text-foreground mb-1">
                    Prénom
                  </label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-600 transition-colors" />
                    <input
                      id="register-first-name"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-2 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-last-name" className="block text-xs font-semibold text-foreground mb-1">
                    Nom
                  </label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-600 transition-colors" />
                    <input
                      id="register-last-name"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-2 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="register-email" className="block text-xs font-semibold text-foreground mb-1">
                  Email
                </label>
                <div className="relative group">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-600 transition-colors" />
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-2 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="register-phone" className="block text-xs font-semibold text-foreground mb-1">
                  Téléphone (optionnel)
                </label>
                <div className="relative group">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-600 transition-colors" />
                  <input
                    id="register-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-2 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                    placeholder="+261 34 XX XX XX XX"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-password" className="block text-xs font-semibold text-foreground mb-1">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-600 transition-colors" />
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'toggle-password' })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-foreground mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative group">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-600 transition-colors" />
                    <input
                      id="register-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'toggle-confirm-password' })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>


              {/* Submit Button */}
              <m.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </m.button>
            </form>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">
                  Ou continuer avec
                </span>
              </div>
            </div>

            {/* Google Button */}
            <m.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                try {
                  await signIn.social({ provider: 'google', callbackURL: '/' });
                } catch {
                  dispatch({ type: 'error', value: 'Erreur lors de la connexion avec Google' });
                }
              }}
              type="button"
              className="w-full py-2.5 px-6 bg-card border-2 border-border hover:border-primary-300 dark:hover:border-primary-600 hover:bg-muted text-foreground font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
            </m.button>

            {/* Footer */}
            <div className="mt-3 text-center text-xs text-muted-foreground">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}

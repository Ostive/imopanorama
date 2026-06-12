'use client';

import { useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/infrastructure/auth/auth-client';
import { m } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

type LoginState = {
  email: string;
  password: string;
  isLoading: boolean;
  error: string;
  showPassword: boolean;
};

type LoginAction =
  | { type: 'field'; name: 'email' | 'password'; value: string }
  | { type: 'loading'; value: boolean }
  | { type: 'error'; value: string }
  | { type: 'togglePassword' };

const loginInitialState: LoginState = {
  email: '',
  password: '',
  isLoading: false,
  error: '',
  showPassword: false,
};

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case 'field':
      return { ...state, [action.name]: action.value };
    case 'loading':
      return { ...state, isLoading: action.value };
    case 'error':
      return { ...state, error: action.value };
    case 'togglePassword':
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
}

function LoginBrandingPanel() {
  return (
    <div className="hidden lg:flex w-1/2 relative z-10 items-center justify-center p-12 bg-primary-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative max-w-md">
        <Image
          src="/images/brand/logo.png"
          alt="ImoPanorama Madagascar"
          width={320}
          height={96}
          className="h-24 w-auto object-contain brightness-0 invert mb-8"
          priority
        />
        <h2 className="text-4xl font-bold mb-4">Espace ImoPanorama</h2>
        <p className="text-lg text-white/85 leading-relaxed">
          Connectez-vous pour gérer vos biens, suivre vos demandes et retrouver vos favoris.
        </p>
      </div>
    </div>
  );
}

export default function LoginNewPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(loginReducer, loginInitialState);
  const { email, password, isLoading, error, showPassword } = state;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'error', value: '' });
    dispatch({ type: 'loading', value: true });

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        dispatch({ type: 'error', value: result.error.message || 'Erreur de connexion' });
      } else {
        // Check if there's a redirect parameter in URL
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get('redirect');

        if (redirectTo) {
          router.push(redirectTo);
        } else {
          // Redirect based on user role
          const userRole = (result.data?.user as any)?.role?.toUpperCase();
          if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }
      }
    } catch (err) {
      dispatch({ type: 'error', value: 'Une erreur est survenue lors de la connexion' });
    } finally {
      dispatch({ type: 'loading', value: false });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Check if there's a redirect parameter in URL
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get('redirect') || '/';

      await signIn.social({
        provider: 'google',
        callbackURL: redirectTo,
      });
    } catch (err) {
      dispatch({ type: 'error', value: 'Erreur lors de la connexion avec Google' });
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

      <LoginBrandingPanel />

      {/* Right Side - Login Form */}
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
          className="w-full max-w-md"
        >
          <div className="p-6">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Image
                src="/images/brand/logo.png"
                alt="ImoPanorama Madagascar"
                width={320}
                height={100}
                className="h-28 w-auto object-contain"
                priority
              />
            </div>

            {/* Header */}
            <div className="mb-6 text-center">
              <p className="text-foreground">Bienvenue ! Connectez-vous pour continuer</p>
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

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <div className="relative group">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-600 transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => dispatch({ type: 'field', name: 'email', value: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-2.5 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-foreground mb-2">
                  Mot de passe
                </label>
                <div className="relative group">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-600 transition-colors" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => dispatch({ type: 'field', name: 'password', value: e.target.value })}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'togglePassword' })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <m.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </m.button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">
                  Ou continuer avec
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <m.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full py-3.5 px-6 bg-card border-2 border-border hover:border-primary-300 hover:bg-muted text-foreground font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-md"
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

              {/* OAuth Info */}
              <p className="text-xs text-center text-muted-foreground px-4">
                En vous connectant avec Google, un compte sera automatiquement créé si vous n'en avez pas encore.
              </p>
            </div>

            {/* Test Users - Development Only */}
            {process.env.NODE_ENV === 'development' && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-linear-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Comptes de test
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Admin */}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'field', name: 'email', value: 'admin@imopanorama.mg' });
                      dispatch({ type: 'field', name: 'password', value: 'Admin123!' });
                    }}
                    className="px-3 py-2 bg-card hover:bg-linear-to-r hover:from-primary-600 hover:to-primary-600 hover:text-white border border-border hover:border-transparent rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-base">👑</span>
                    Admin
                  </button>

                  {/* Super Admin */}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'field', name: 'email', value: 'superadmin@imopanorama.mg' });
                      dispatch({ type: 'field', name: 'password', value: 'SuperAdmin123!' });
                    }}
                    className="px-3 py-2 bg-card hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white border border-border hover:border-transparent rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-base">⚡</span>
                    Super Admin
                  </button>

                  {/* Agent */}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'field', name: 'email', value: 'agent@imopanorama.mg' });
                      dispatch({ type: 'field', name: 'password', value: 'Agent123!' });
                    }}
                    className="px-3 py-2 bg-card hover:bg-linear-to-r hover:from-green-600 hover:to-teal-600 hover:text-white border border-border hover:border-transparent rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-base">👔</span>
                    Agent
                  </button>

                  {/* Client */}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'field', name: 'email', value: 'client@imopanorama.mg' });
                      dispatch({ type: 'field', name: 'password', value: 'Client123!' });
                    }}
                    className="px-3 py-2 bg-card hover:bg-linear-to-r hover:from-orange-600 hover:to-red-600 hover:text-white border border-border hover:border-transparent rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-base">💼</span>
                    Client
                  </button>

                  {/* User */}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'field', name: 'email', value: 'user@imopanorama.mg' });
                      dispatch({ type: 'field', name: 'password', value: 'User123!' });
                    }}
                    className="px-3 py-2 bg-card hover:bg-linear-to-r hover:from-gray-600 hover:to-gray-700 hover:text-white border border-border hover:border-transparent rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-base">👤</span>
                    Utilisateur
                  </button>
                </div>
              </m.div>
            )}

            {/* Footer */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link
                href="/register"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}

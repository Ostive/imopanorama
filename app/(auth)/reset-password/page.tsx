'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { authClient } from '@/infrastructure/auth/auth-client';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token manquant ou invalide.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(result.error.message || 'Le lien est invalide ou a expiré.');
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2500);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Lien invalide</h1>
        <p className="text-gray-600 mb-8">
          Ce lien de réinitialisation est invalide ou a expiré. Demandez un nouveau lien depuis la page de connexion.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-xl transition-all"
        >
          Demander un nouveau lien
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Mot de passe mis à jour</h1>
        <p className="text-gray-600 mb-8">
          Votre mot de passe a bien été réinitialisé. Vous allez être redirigé vers la page de connexion…
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-xl transition-all"
        >
          Me connecter maintenant
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-primary-600 mb-2">Nouveau mot de passe</h1>
        <p className="text-gray-700">Choisissez un mot de passe d'au moins 8 caractères.</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative group">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoFocus
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative group">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Mettre à jour le mot de passe
              <ArrowRightIcon className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
          Retour à la connexion
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-primary-50 via-white to-accent-50 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary-600 via-primary-700 to-primary-800"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-300/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="relative w-80 h-80 mb-8 mx-auto">
              <Image
                src="/images/auth-illustration.png"
                alt="ImoPanorama Logo"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Presque fini !</h2>
            <p className="text-xl text-white/95 max-w-md leading-relaxed">
              Choisissez un nouveau mot de passe sécurisé pour protéger votre compte.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10">
        <Link
          href="/login"
          className="absolute top-8 left-8 p-3 bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-primary-500 rounded-xl shadow-lg hover:shadow-xl transition-all group"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
        </Link>

        <div className="lg:hidden absolute top-6 left-1/2 -translate-x-1/2">
          <Image
            src="/images/logo.png"
            alt="ImoPanorama Madagascar"
            width={140}
            height={44}
            className="h-11 w-auto object-contain"
            priority
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="p-6">
            <Suspense fallback={<div className="text-center text-gray-500">Chargement…</div>}>
              <ResetPasswordContent />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

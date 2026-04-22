'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useTheme } from '@/shared/theme/ThemeContext';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { UpdateProfileData, ChangePasswordData, User } from './types';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  KeyIcon,
  ShieldCheckIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

function ProfileForm() {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    company: user?.company || ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        company: user.company || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil');
      console.error('Erreur mise à jour profil:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <UserIcon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Informations personnelles
        </h3>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 px-6 py-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-700 dark:text-green-300">Profil mis à jour avec succès !</span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 bg-linear-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-l-4 border-red-500 px-6 py-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-700 dark:text-red-300">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <UserIcon className="h-4 w-4 mr-2" />
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <UserIcon className="h-4 w-4 mr-2" />
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <PhoneIcon className="h-4 w-4 mr-2" />
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white transition-all"
            placeholder="+261 34 XX XX XX XX"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <BuildingOfficeIcon className="h-4 w-4 mr-2" />
            Entreprise
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white transition-all"
            placeholder="Nom de votre entreprise"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
              Mise à jour...
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Mettre à jour
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

function PasswordForm() {
  const { changePassword, loading } = useAuth();
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      await changePassword(formData);
      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') setShowCurrentPassword(!showCurrentPassword);
    if (field === 'new') setShowNewPassword(!showNewPassword);
    if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <KeyIcon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Sécurité du compte
        </h3>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 px-6 py-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-700 dark:text-green-300">Mot de passe modifié avec succès !</span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 bg-linear-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-l-4 border-red-500 px-6 py-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-700 dark:text-red-300">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <KeyIcon className="h-4 w-4 mr-2" />
            Mot de passe actuel
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white transition-all"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showCurrentPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <KeyIcon className="h-4 w-4 mr-2" />
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white transition-all"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <KeyIcon className="h-4 w-4 mr-2" />
            Confirmer le nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white transition-all"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
              Modification...
            </>
          ) : (
            <>
              <KeyIcon className="h-5 w-5 mr-2" />
              Changer le mot de passe
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

function UserStats({ user }: { user: any }) {
  const router = useRouter();
  const [stats, setStats] = useState({
    favorisCount: 0,
    lastLoginDate: user?.lastLoginAt || null,
    memberSince: user?.createdAt || null
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <ChartBarIcon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Statistiques du compte
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Membre depuis</span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {stats.memberSince ? new Date(stats.memberSince).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dernière connexion</span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {stats.lastLoginDate ? new Date(stats.lastLoginDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A'}
          </span>
        </div>

        <a
          href="/favoris"
          onClick={(e) => {
            e.preventDefault();
            router.push('/favoris');
          }}
          className="flex items-center justify-between p-4 bg-linear-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl hover:from-primary-100 hover:to-blue-100 dark:hover:from-primary-900/30 dark:hover:to-blue-900/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">Mes favoris</span>
          </div>
          <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 rounded-full">
            {stats.favorisCount}
          </span>
        </a>
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'security', name: 'Sécurité', icon: KeyIcon },
    { id: 'stats', name: 'Statistiques', icon: ChartBarIcon },
  ];

  return (
    <ProtectedRoute requireAuth>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-linear-to-br from-primary-600 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold">
                    {user?.firstName?.charAt(0)?.toUpperCase() || '?'}{user?.lastName?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.firstName || ''} {user?.lastName || ''}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <EnvelopeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-300">{user?.email || ''}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${user?.role?.toLowerCase() === 'admin'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200'
                      : user?.role?.toLowerCase() === 'agent'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200'
                      }`}>
                      <ShieldCheckIcon className="-ml-0.5 mr-1.5 h-3 w-3" />
                      {user?.role?.toLowerCase() === 'admin' ? 'Administrateur' :
                        user?.role?.toLowerCase() === 'agent' ? 'Agent' : 'Utilisateur'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'super_admin') && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/admin');
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all"
                  >
                    <ShieldCheckIcon className="-ml-1 mr-2 h-5 w-5" />
                    Administration
                  </motion.a>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 font-semibold shadow-lg transition-all"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Se déconnecter
                </motion.button>
              </div>
            </div>

            {/* Modern Tabs */}
            <div className="mt-8">
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-2xl p-2">
                <div className="flex gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${activeTab === tab.id
                          ? 'bg-linear-to-r from-primary-600 to-blue-600 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        {tab.name}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && <ProfileForm key="profile" />}
            {activeTab === 'security' && <PasswordForm key="security" />}
            {activeTab === 'stats' && <UserStats key="stats" user={user} />}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect, useReducer } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { m, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/features/auth/context/AuthContext';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { UpdateProfileData, ChangePasswordData } from './types';
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
  ChartBarIcon,
} from '@heroicons/react/24/outline';

/* ── Shared alert components ── */
function SuccessAlert({ message }: { message: string }) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-5 flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-xl"
    >
      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
      <span className="text-sm font-semibold text-green-700 dark:text-green-300">{message}</span>
    </m.div>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-5 flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl"
    >
      <ExclamationCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
      <span className="text-sm font-semibold text-red-700 dark:text-red-300">{message}</span>
    </m.div>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-lg p-4 sm:p-8 border border-border"
    >
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-primary-600 to-primary-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
          {icon}
        </div>
        <h3 className="text-base sm:text-xl font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </m.div>
  );
}

/* ── ProfileForm ── */
function ProfileForm() {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        company: user.company || '',
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <SectionCard icon={<UserIcon className="h-5 w-5 text-white" />} title="Informations personnelles">
      <AnimatePresence>
        {success && <SuccessAlert message="Profil mis à jour avec succès !" />}
        {error && <ErrorAlert message={error} />}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'firstName', label: 'Prénom', icon: UserIcon },
            { id: 'lastName', label: 'Nom', icon: UserIcon },
          ].map(({ id, label, icon: Icon }) => (
            <div key={id}>
              <label htmlFor={`profile-${id}`} className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </label>
              <input
                id={`profile-${id}`}
                type="text"
                name={id}
                value={(formData as any)[id]}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-border bg-input rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-foreground text-sm transition-all"
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="profile-phone" className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
            <PhoneIcon className="h-3.5 w-3.5" />
            Téléphone
          </label>
          <input
            id="profile-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+261 34 XX XX XX"
            className="w-full px-3 py-2.5 border border-border bg-input rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-foreground text-sm transition-all"
          />
        </div>

        <div>
          <label htmlFor="profile-company" className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
            <BuildingOfficeIcon className="h-3.5 w-3.5" />
            Entreprise
          </label>
          <input
            id="profile-company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nom de votre entreprise"
            className="w-full px-3 py-2.5 border border-border bg-input rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-foreground text-sm transition-all"
          />
        </div>

        <m.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><ArrowPathIcon className="h-4 w-4 animate-spin" />Mise à jour...</>
          ) : (
            <><CheckCircleIcon className="h-4 w-4" />Enregistrer</>
          )}
        </m.button>
      </form>
    </SectionCard>
  );
}

/* ── PasswordForm ── */
type PasswordFormState = {
  formData: ChangePasswordData;
  success: boolean;
  error: string;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
};
type PasswordFormAction =
  | { type: 'field'; name: keyof ChangePasswordData; value: string }
  | { type: 'error'; value: string }
  | { type: 'success'; value: boolean }
  | { type: 'reset' }
  | { type: 'toggle'; field: 'current' | 'new' | 'confirm' };

const pwdInit: PasswordFormState = {
  formData: { currentPassword: '', newPassword: '', confirmPassword: '' },
  success: false,
  error: '',
  showCurrent: false,
  showNew: false,
  showConfirm: false,
};

function pwdReducer(state: PasswordFormState, action: PasswordFormAction): PasswordFormState {
  switch (action.type) {
    case 'field': return { ...state, formData: { ...state.formData, [action.name]: action.value } };
    case 'error': return { ...state, error: action.value };
    case 'success': return { ...state, success: action.value };
    case 'reset': return { ...state, formData: pwdInit.formData };
    case 'toggle':
      if (action.field === 'current') return { ...state, showCurrent: !state.showCurrent };
      if (action.field === 'new') return { ...state, showNew: !state.showNew };
      return { ...state, showConfirm: !state.showConfirm };
  }
}

function PasswordInput({
  id, label, name, value, show, onToggle, onChange, required,
}: {
  id: string; label: string; name: string; value: string;
  show: boolean; onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-1.5">
        <KeyIcon className="h-3.5 w-3.5" />
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3 py-2.5 pr-10 border border-border bg-input rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-foreground text-sm transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function PasswordForm() {
  const { changePassword, loading } = useAuth();
  const [state, dispatch] = useReducer(pwdReducer, pwdInit);
  const { formData, success, error, showCurrent, showNew, showConfirm } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'error', value: '' });
    if (formData.newPassword !== formData.confirmPassword) {
      dispatch({ type: 'error', value: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }
    try {
      await changePassword(formData);
      dispatch({ type: 'success', value: true });
      dispatch({ type: 'reset' });
      setTimeout(() => dispatch({ type: 'success', value: false }), 3000);
    } catch (err) {
      dispatch({ type: 'error', value: err instanceof Error ? err.message : 'Erreur lors du changement' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'field', name: e.target.name as keyof ChangePasswordData, value: e.target.value });
  };

  return (
    <SectionCard icon={<KeyIcon className="h-5 w-5 text-white" />} title="Sécurité du compte">
      <AnimatePresence>
        {success && <SuccessAlert message="Mot de passe modifié avec succès !" />}
        {error && <ErrorAlert message={error} />}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <PasswordInput
          id="pwd-current" label="Mot de passe actuel" name="currentPassword"
          value={formData.currentPassword} show={showCurrent}
          onToggle={() => dispatch({ type: 'toggle', field: 'current' })}
          onChange={handleChange} required
        />
        <PasswordInput
          id="pwd-new" label="Nouveau mot de passe" name="newPassword"
          value={formData.newPassword} show={showNew}
          onToggle={() => dispatch({ type: 'toggle', field: 'new' })}
          onChange={handleChange} required
        />
        <PasswordInput
          id="pwd-confirm" label="Confirmer le nouveau mot de passe" name="confirmPassword"
          value={formData.confirmPassword} show={showConfirm}
          onToggle={() => dispatch({ type: 'toggle', field: 'confirm' })}
          onChange={handleChange} required
        />

        <m.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><ArrowPathIcon className="h-4 w-4 animate-spin" />Modification...</>
          ) : (
            <><KeyIcon className="h-4 w-4" />Changer le mot de passe</>
          )}
        </m.button>
      </form>
    </SectionCard>
  );
}

/* ── UserStats ── */
function UserStats({ user }: { user: any }) {
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const lastLogin = user?.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <SectionCard icon={<ChartBarIcon className="h-5 w-5 text-white" />} title="Mon compte">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
              <CalendarIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-sm font-semibold text-foreground">Membre depuis</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-foreground">{memberSince}</span>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <CalendarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-semibold text-foreground">Dernière connexion</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-foreground">{lastLogin}</span>
        </div>

        <Link
          href="/favoris"
          className="flex items-center justify-between p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <HeartIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">Mes favoris</span>
          </div>
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-2.5 py-1 rounded-full">
            Voir →
          </span>
        </Link>

        <Link
          href="/mes-demandes"
          className="flex items-center justify-between p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <EnvelopeIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Mes demandes</span>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-full">
            Voir →
          </span>
        </Link>
      </div>
    </SectionCard>
  );
}

/* ── Tabs ── */
const TABS = [
  { id: 'profile', name: 'Profil', icon: UserIcon },
  { id: 'security', name: 'Sécurité', icon: KeyIcon },
  { id: 'compte', name: 'Compte', icon: ChartBarIcon },
];

/* ── Main page ── */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch {}
  };

  const role = user?.role?.toLowerCase();
  const roleLabel = role === 'admin' || role === 'super_admin' ? 'Administrateur' : role === 'agent' ? 'Agent' : 'Utilisateur';
  const roleBadgeClass = role === 'admin' || role === 'super_admin'
    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200'
    : role === 'agent'
    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 border-primary-200'
    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200';

  return (
    <ProtectedRoute requireAuth>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:bg-gray-900 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">

          {/* Profile header card */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6 border border-border"
          >
            {/* Avatar + info + actions */}
            <div className="flex items-start justify-between gap-3">
              {/* Left: avatar + name */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-primary-600 to-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-lg sm:text-2xl font-bold">
                    {user?.firstName?.charAt(0)?.toUpperCase() || '?'}{user?.lastName?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-2xl font-bold text-foreground truncate">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">{user?.email}</p>
                  <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-lg text-xs font-bold border ${roleBadgeClass}`}>
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    {roleLabel}
                  </span>
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                {(role === 'admin' || role === 'super_admin') && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all whitespace-nowrap"
                  >
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Administration</span>
                    <span className="sm:hidden">Admin</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs sm:text-sm font-semibold shadow-md transition-all whitespace-nowrap"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Se déconnecter</span>
                  <span className="sm:hidden">Quitter</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-5 sm:mt-8 bg-gray-100 dark:bg-gray-700/50 rounded-xl sm:rounded-2xl p-1 sm:p-2">
              <div className="flex gap-1 sm:gap-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-muted-foreground hover:bg-white dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </m.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && <ProfileForm key="profile" />}
            {activeTab === 'security' && <PasswordForm key="security" />}
            {activeTab === 'compte' && <UserStats key="compte" user={user} />}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}

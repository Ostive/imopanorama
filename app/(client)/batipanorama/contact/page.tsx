'use client';

import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  HomeModernIcon,
  CurrencyDollarIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

import { ContactFormData } from '@/features/batipanorama/types/batipanorama.types';


export default function BatiPanoramaContactPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    location: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  const projectTypes = [
    { value: 'maison', label: 'Maison individuelle' },
    { value: 'villa', label: 'Villa de luxe' },
    { value: 'commercial', label: 'Bâtiment commercial' },
    { value: 'renovation', label: 'Rénovation' },
    { value: 'extension', label: 'Extension' },
    { value: 'autre', label: 'Autre' }
  ];

  const budgetRanges = [
    { value: 'moins-50k', label: 'Moins de 50 000 €' },
    { value: '50k-100k', label: '50 000 € - 100 000 €' },
    { value: '100k-200k', label: '100 000 € - 200 000 €' },
    { value: '200k-500k', label: '200 000 € - 500 000 €' },
    { value: 'plus-500k', label: 'Plus de 500 000 €' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent('/batipanorama/contact')}`);
      }, 2000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Send to API
      const response = await fetch('/api/bati-quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du devis');
      }

      setSubmitStatus('success');
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        projectType: '',
        budget: '',
        location: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Téléphone',
      content: '+261 20 22 123 45',
      link: 'tel:+261202212345',
      gradient: 'from-primary-500 to-cyan-500'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'contact@batipanorama.mg',
      link: 'mailto:contact@batipanorama.mg',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPinIcon,
      title: 'Adresse',
      content: 'Antananarivo, Madagascar',
      link: null,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: ClockIcon,
      title: 'Horaires',
      content: 'Lun-Ven: 8h-17h',
      link: null,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20">
      {/* Header */}
      <div className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <Link
                href="/batipanorama"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Retour à BatiPanorama
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary-600 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BuildingOffice2Icon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Contactez-nous</h1>
              </div>
              <p className="text-xl text-gray-300">
                Parlons de votre projet de construction
              </p>
            </div>
          </m.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Nos Coordonnées</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <m.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${info.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-muted-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.content}</p>
                          )}
                        </div>
                      </div>
                    </m.div>
                  );
                })}
              </div>
            </m.div>

            {/* Why Choose Us */}
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-linear-to-br from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-900/40"
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Pourquoi nous choisir ?</h3>
              <ul className="space-y-3">
                {[
                  '15+ ans d\'expérience',
                  'Devis gratuit sous 48h',
                  'Matériaux de qualité',
                  'Garantie décennale',
                  'Suivi personnalisé'
                ].map((item, index) => (
                  <li key={item} className="flex items-center gap-2 text-foreground">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </m.div>
          </div>

          {/* Contact Form */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-primary-600 rounded-xl flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Demande de devis</h2>
                </div>

                {/* Auth Status Badge */}
                {!authLoading && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${isAuthenticated
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                    }`}>
                    {isAuthenticated ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4" />
                        Connecté
                      </>
                    ) : (
                      <>
                        <ShieldExclamationIcon className="h-4 w-4" />
                        Connexion requise
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Authentication Warning */}
              {showAuthWarning && (
                <m.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-l-4 border-orange-500 p-6 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <ShieldExclamationIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    <div>
                      <h3 className="font-semibold text-orange-900 dark:text-orange-200 mb-1">Connexion requise</h3>
                      <p className="text-orange-700 dark:text-orange-300 text-sm">
                        Vous devez être connecté pour envoyer une demande de devis. Redirection vers la page de connexion...
                      </p>
                    </div>
                  </div>
                </m.div>
              )}

              {submitStatus === 'success' && (
                <m.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 p-6 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-bold text-green-800 dark:text-green-200">Message envoyé avec succès !</h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Nous vous répondrons dans les plus brefs délais.
                      </p>
                    </div>
                  </div>
                </m.div>
              )}

              {submitStatus === 'error' && (
                <m.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 bg-linear-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-l-4 border-red-500 p-6 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    <div>
                      <h3 className="font-bold text-red-800 dark:text-red-200">Erreur</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </m.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bati-first-name" className="flex items-center text-sm font-semibold text-foreground mb-2">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Prénom *
                    </label>
                    <input
                      id="bati-first-name"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-border bg-card text-foreground rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="bati-last-name" className="flex items-center text-sm font-semibold text-foreground mb-2">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Nom *
                    </label>
                    <input
                      id="bati-last-name"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-border bg-card text-foreground rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bati-email" className="flex items-center text-sm font-semibold text-foreground mb-2">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Email *
                    </label>
                    <input
                      id="bati-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-border bg-card text-foreground rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="bati-phone" className="flex items-center text-sm font-semibold text-foreground mb-2">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Téléphone *
                    </label>
                    <input
                      id="bati-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-border bg-card text-foreground rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="+261 34 XX XX XX XX"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="flex items-center text-sm font-semibold text-foreground mb-2">
                      <HomeModernIcon className="h-4 w-4 mr-2" />
                      Type de projet *
                    </p>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="flex items-center text-sm font-semibold text-foreground mb-2">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      Budget estimé *
                    </p>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez un budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="bati-location" className="flex items-center text-sm font-semibold text-foreground mb-2">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Localisation du projet *
                  </label>
                  <input
                    id="bati-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-border bg-card text-foreground rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Ville ou région à Madagascar"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="bati-message" className="flex items-center text-sm font-semibold text-foreground mb-2">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Décrivez votre projet *
                  </label>
                  <textarea
                    id="bati-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full p-3 border border-border bg-card text-foreground rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Décrivez votre projet en détail : surface souhaitée, nombre de pièces, spécificités, délais..."
                  />
                </div>

                {/* Submit Button */}
                <m.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="h-5 w-5" />
                      Envoyer ma demande
                    </>
                  )}
                </m.button>

                <p className="text-sm text-gray-500 text-center">
                  * Champs obligatoires. Vos données sont protégées et ne seront pas partagées.
                </p>
              </form>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
}

'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFaq, useFaqs } from '@/features/faqs/hooks/useFaqs';
import { FaqFormData } from '@/features/faqs/types/faqs.types';
import FaqForm from '@/features/faqs/components/admin/FaqForm';
import toast from 'react-hot-toast';

interface EditFaqPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditFaqPage({ params }: EditFaqPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);
  const { faq, loading, error } = useFaq(id);
  const { updateFaq } = useFaqs();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FaqFormData) => {
    setIsSubmitting(true);
    try {
      const updatedFaq = await updateFaq(id, data);
      if (updatedFaq) {
        toast.success('Question mise à jour avec succès');
        router.push('/admin/faqs');
      } else {
        toast.error('Erreur lors de la mise à jour de la question');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la question:', error);
      toast.error('Erreur lors de la mise à jour de la question');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !faq) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Erreur: Impossible de charger la question. Veuillez réessayer plus tard.
        </div>
        <button
          onClick={() => router.push('/admin/faqs')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Retour à la liste
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Modifier la FAQ</h1>
        <p className="text-gray-600 mt-1">
          Modifiez les détails de la question fréquente.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FaqForm 
          initialData={faq}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
      </div>
    </div>
  );
}

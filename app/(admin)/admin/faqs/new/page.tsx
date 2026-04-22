'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFaqs } from '@/features/faqs/hooks/useFaqs';
import { FaqFormData } from '@/features/faqs/types';
import FaqForm from '@/features/faqs/components/admin/FaqForm';
import toast from 'react-hot-toast';

export default function NewFaqPage() {
  const router = useRouter();
  const { createFaq } = useFaqs();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FaqFormData) => {
    setIsSubmitting(true);
    try {
      const newFaq = await createFaq(data);
      if (newFaq) {
        toast.success('Question ajoutée avec succès');
        router.push('/admin/faqs');
      } else {
        toast.error('Erreur lors de l\'ajout de la question');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la question:', error);
      toast.error('Erreur lors de l\'ajout de la question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ajouter une nouvelle FAQ</h1>
        <p className="text-gray-600 mt-1">
          Créez une nouvelle question fréquente qui sera affichée sur le site.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FaqForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
      </div>
    </div>
  );
}

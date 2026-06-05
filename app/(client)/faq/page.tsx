import { Metadata } from 'next';
import FaqList from '@/features/faqs/components/FaqList';

export const metadata: Metadata = {
  title: 'Questions fréquentes | ImoPanorama',
  description: 'Des réponses simples aux questions que vous vous posez avant d\'acheter, louer, vendre ou investir à Madagascar.',
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background transition-colors duration-200">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Vos questions, nos réponses
            </h1>
            <div className="w-20 h-1 mb-6 bg-primary-500 dark:bg-primary-400" />
            <p className="text-lg text-muted-foreground">
              Retrouvez des réponses simples sur l'immobilier à Madagascar. Et si votre question n'est pas encore ici, contactez-nous : on vous répondra directement.
            </p>
          </div>
          
          <FaqList 
            limit={10}
            showFilters={true}
            showPagination={true}
          />
        </div>
      </div>
    </main>
  );
}

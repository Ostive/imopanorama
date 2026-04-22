import { Metadata } from 'next';
import NewsClient from './NewsClient';

export const metadata: Metadata = {
  title: 'Articles et conseils | ImoPanorama Madagascar',
  description: 'Conseils immobiliers, tendances locales et actualités utiles pour acheter, louer ou construire à Madagascar avec plus de confiance.',
};

export default function NewsPage() {
  return <NewsClient />;
}

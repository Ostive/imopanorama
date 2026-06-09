import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Actualités et articles sur l\'immobilier à Madagascar — ImoPanorama.',
}

export default function BlogRedirectPage() {
  permanentRedirect('/actualites');
}

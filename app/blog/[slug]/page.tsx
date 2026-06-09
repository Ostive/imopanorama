import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Article de blog',
  description: 'Lisez nos articles sur l\'immobilier à Madagascar — ImoPanorama.',
}

export default async function BlogPostRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  permanentRedirect(`/actualites/${slug}`);
}

export interface ProjectImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  featured?: boolean;
}

export interface ProjectDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  client: string;
  year: number;
  surface: string;
  category: string;
  status: 'completed' | 'in-progress' | 'planning';
  tags: string[];
  coverImage: string;
  images: ProjectImage[];
  features?: string[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  architecte?: string;
  budget?: string;
}

export type ProjectCategory = 'residential' | 'commercial' | 'industrial' | 'renovation' | 'all';

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
}
